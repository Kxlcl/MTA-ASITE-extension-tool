// ============================================================
// background.js  –  Service Worker (MV3)
// Fetches blobs from Azure using a SAS token.
// ============================================================

const STORAGE_ACCOUNT = "asitemta";
const CONTAINER       = "asite-mta-data";
const BASE_URL        = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER}`;

// ---------- SAS token – generate from Azure Portal ----------
// Portal → Storage Account → Data storage → Containers → select container
//        → Shared access signature → Generate SAS and URL
// Paste the query string here WITHOUT the leading '?'
const SAS_TOKEN = "YOUR_SAS_TOKEN_HERE";

// ---------- List blobs with a given prefix ----------
async function listBlobs(prefix) {
  const url = `${BASE_URL}?restype=container&comp=list&prefix=${encodeURIComponent(prefix)}&maxresults=5000&${SAS_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`List failed: ${res.status} ${res.statusText}`);
  const xml  = await res.text();
  const names = [...xml.matchAll(/<Name>([^<]+)<\/Name>/g)].map(m => m[1]);
  return names;
}

// ---------- Download a single blob and trigger browser download ----------
async function downloadBlob(blobPath) {
  const url = `${BASE_URL}/${encodeURIComponent(blobPath).replace(/%2F/g, "/")}?${SAS_TOKEN}`;
  const res = await fetch(url);
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
        const url = `${BASE_URL}?restype=container&comp=list&maxresults=1&${SAS_TOKEN}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  }
});
