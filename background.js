// ============================================================
// background.js  –  Service Worker (MV3)
// Fetches blobs from Azure using Azure AD authentication.
// ============================================================

const STORAGE_ACCOUNT = "asitemta";
const CONTAINER       = "asite-mta-data";
const BASE_URL        = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER}`;

// ---------- Azure AD Configuration ----------
// Register your app at https://portal.azure.com → Azure Active Directory → App registrations
// Set redirect URI to: chrome-extension://<your-extension-id>/offscreen.html
const AZURE_CONFIG = {
  clientId: "YOUR_CLIENT_ID_HERE",  // Application (client) ID from Azure
  tenantId: "YOUR_TENANT_ID_HERE",  // Directory (tenant) ID from Azure
};

// Global token storage
let accessToken = null;

// ---------- Create offscreen document for MSAL ----------
async function ensureOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: offscreenUrl,
    reasons: ["DOM_SCRAPING"],
    justification: "MSAL authentication requires DOM"
  });
}

// ---------- Authenticate via Azure AD ----------
async function authenticate() {
  await ensureOffscreenDocument();

  const extensionId = chrome.runtime.id;
  const authority = `https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}`;
  const redirectUri = `https://${extensionId}.chromiumapp.org/offscreen.html`;

  return new Promise((resolve, reject) => {
    const listener = (msg) => {
      if (msg.type === "AUTH_COMPLETE") {
        chrome.runtime.onMessage.removeListener(listener);
        if (msg.error) {
          reject(new Error(msg.error));
        } else {
          accessToken = msg.token;
          resolve(msg.token);
        }
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    chrome.runtime.sendMessage({
      type: "START_AUTH",
      config: {
        clientId: AZURE_CONFIG.clientId,
        authority,
        redirectUri
      }
    });
  });
}

// ---------- List blobs with a given prefix ----------
async function listBlobs(prefix) {
  if (!accessToken) throw new Error("Not authenticated");

  const url = `${BASE_URL}?restype=container&comp=list&prefix=${encodeURIComponent(prefix)}&maxresults=5000`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "x-ms-version": "2021-08-06"
    }
  });
  if (!res.ok) throw new Error(`List failed: ${res.status} ${res.statusText}`);
  const xml  = await res.text();
  const names = [...xml.matchAll(/<Name>([^<]+)<\/Name>/g)].map(m => m[1]);
  return names;
}

// ---------- Download a single blob and trigger browser download ----------
async function downloadBlob(blobPath) {
  if (!accessToken) throw new Error("Not authenticated");

  const url = `${BASE_URL}/${encodeURIComponent(blobPath).replace(/%2F/g, "/")}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "x-ms-version": "2021-08-06"
    }
  });
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  const blob     = await res.blob();
  const dataUrl  = await blobToDataUrl(blob);
  const fileName = blobPath.split("/").pop();
  await chrome.downloads.download({ url: dataUrl, filename: fileName, saveAs: false });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ============================================================
// Message router – popup sends messages here
// ============================================================
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "LIST_BLOBS") {
    (async () => {
      try {
        const blobs = await listBlobs(msg.prefix);
        sendResponse({ ok: true, blobs });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  }

  if (msg.type === "DOWNLOAD_BLOB") {
    (async () => {
      try {
        await downloadBlob(msg.blobPath);
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  }

  if (msg.type === "CONNECTION_TEST") {
    (async () => {
      try {
        // Authenticate and test connection
        await authenticate();
        const url = `${BASE_URL}?restype=container&comp=list&maxresults=1`;
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "x-ms-version": "2021-08-06"
          }
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  }

  if (msg.type === "AUTHENTICATE") {
    (async () => {
      try {
        await authenticate();
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  }
});
