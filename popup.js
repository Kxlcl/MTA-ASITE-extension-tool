// ============================================================
// popup.js  –  UI logic for the Azure Blob Downloader popup
// ============================================================

// ── State ─────────────────────────────────────────────────
let parsedNumbers = [];   // string[]  – zero-padded numbers from CSV
let csvLoaded     = false;
let authed        = false;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {

// ── DOM refs ──────────────────────────────────────────────
const folderInput   = document.getElementById("folderInput");
const dropzone      = document.getElementById("dropzone");
const fileInput     = document.getElementById("fileInput");
const fileChip      = document.getElementById("fileChip");
const chipName      = document.getElementById("chipName");
const chipRemove    = document.getElementById("chipRemove");
const downloadBtn   = document.getElementById("downloadBtn");
const logEl         = document.getElementById("log");
const activitySection = document.getElementById("activitySection");
const statusDot     = document.getElementById("statusDot");
const statusText    = document.getElementById("statusText");
const authBtn       = document.getElementById("authBtn");
const summary       = document.getElementById("summary");
const sumSearched   = document.getElementById("sumSearched");
const sumFound      = document.getElementById("sumFound");
const sumDownloaded = document.getElementById("sumDownloaded");

// ── Logging ───────────────────────────────────────────────
function log(msg, cls = "") {
  activitySection.style.display = "block";
  const line = document.createElement("div");
  line.className = "line " + cls;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}
function clearLog() { logEl.innerHTML = ""; }

// ── Auth ──────────────────────────────────────────────────
async function doAuth() {
  setStatus("connecting", "Connecting…");
  try {
    const res = await sendBg({ type: "CONNECTION_TEST" });
    if (res.ok) setStatus("connected", "Connected – ready");
    else        throw new Error(res.error);
  } catch (e) {
    setStatus("error", "Connection failed");
    log("❌ " + e.message, "err");
  }
}

function setStatus(state, label) {
  statusDot.className  = "status-dot " + state;
  statusText.textContent = label;
  if (state === "connected") { authed = true; authBtn.textContent = "Re-test"; }
}

authBtn.addEventListener("click", doAuth);

// ── Dropzone / file pick ──────────────────────────────────
dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

// ── CSV parsing (mirrors the original Python logic exactly) ──
function handleFile(file) {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    log("⚠️  Only .csv files are supported.", "err");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const text  = e.target.result;
    const rows  = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
    if (rows.length === 0) { log("❌ CSV is empty.", "err"); return; }

    let dataRows = rows;
    // Skip header if first cell matches known header names
    const firstCell = rows[0].split(",")[0].trim().toLowerCase();
    if (["number", "numbers", "file", "files"].includes(firstCell)) {
      dataRows = rows.slice(1);
    }

    parsedNumbers = [];
    dataRows.forEach(row => {
      const val = row.split(",")[0].trim();
      if (!val) return;
      // If purely numeric, zero-pad to 4 digits (mirrors Python zfill(4))
      parsedNumbers.push(/^\d+$/.test(val) ? val.padStart(4, "0") : val);
    });

    if (parsedNumbers.length === 0) { log("❌ No valid numbers found in CSV.", "err"); return; }

    // Show chip
    chipName.textContent = file.name;
    fileChip.classList.add("visible");
    csvLoaded = true;
    clearLog();
    parsedNumbers.forEach(n => log(n, "dim"));
    log(`📄 ${parsedNumbers.length} file(s) loaded from "${file.name}"`, "hi");
    updateButtons();
  };
  reader.readAsText(file);
}

chipRemove.addEventListener("click", () => {
  parsedNumbers = [];
  csvLoaded     = false;
  fileChip.classList.remove("visible");
  fileInput.value = "";
  log("Removed CSV file.", "dim");
  updateButtons();
});

// ── Button enable logic ───────────────────────────────────
function updateButtons() {
  const ready = csvLoaded && folderInput.value.trim().length > 0;
  downloadBtn.disabled = !ready;
}
folderInput.addEventListener("input", updateButtons);

// ── Helper: message the service worker ────────────────────
function sendBg(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, resolve);
  });
}

// ── Download ──────────────────────────────────────────────
downloadBtn.addEventListener("click", async () => {
  if (!authed) { log("⚠️  Please log in first.", "err"); return; }

  const prefix = folderInput.value.trim().replace(/\/+$/, "");
  clearLog();
  summary.classList.remove("visible");

  log(`🔍 Fetching blob listing for "${prefix}/…"`, "hi");
  const listRes = await sendBg({ type: "LIST_BLOBS", prefix: prefix + "/" });
  if (!listRes.ok) { log("❌ " + listRes.error, "err"); return; }

  const blobNames = listRes.blobs;

  // Build a lookup: base-name-without-ext → full blob path
  const blobMap = {};
  blobNames.forEach(name => {
    const base = name.split("/").pop().replace(/\.[^.]+$/, "");
    if (!blobMap[base]) blobMap[base] = name;  // first hit wins
  });

  let searched = 0, found = 0, downloaded = 0;
  downloadBtn.disabled = true;

  for (const num of parsedNumbers) {
    searched++;
    const blobPath = blobMap[num];
    if (!blobPath) {
      log(`❌ Not found: ${num}`, "err");
      continue;
    }
    log(`✅ Found: ${blobPath}`, "ok");
    found++;

    // Trigger download via service worker
    const dlRes = await sendBg({ type: "DOWNLOAD_BLOB", blobPath });
    if (dlRes.ok) {
      downloaded++;
      log(`   ⬇️  Downloaded`, "ok");
    } else {
      log(`   ❌ Download error: ${dlRes.error}`, "err");
    }
  }

  // Show summary
  sumSearched.textContent   = searched;
  sumFound.textContent      = found;
  sumDownloaded.textContent = downloaded;
  summary.classList.add("visible");
  log(`\n✨ Done – ${downloaded} file(s) downloaded.`, "hi");
  downloadBtn.disabled = false;
});

}); // End DOMContentLoaded
