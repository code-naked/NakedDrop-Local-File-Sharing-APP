const socket = io();

const addressEl = document.getElementById("address");
const deviceInput = document.getElementById("deviceName");
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const statusEl = document.getElementById("status");
const filesListEl = document.getElementById("filesList");

addressEl.textContent = window.location.origin;

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString();
}

function renderFiles(files) {
  filesListEl.innerHTML = "";
  if (!files.length) {
    filesListEl.innerHTML =
      "<p style='color:#b7baf8;font-size:12px;'>No files shared yet.</p>";
    return;
  }

  files
    .slice()
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .forEach((f) => {
      const card = document.createElement("div");
      card.className = "file-card";

      const main = document.createElement("div");
      main.className = "file-main";

      const name = document.createElement("div");
      name.className = "file-name";
      name.textContent = f.originalName;

      const meta = document.createElement("div");
      meta.className = "file-meta";
      meta.textContent = `${formatSize(f.size)} • from ${f.from} • ${formatTime(
        f.time
      )}`;

      main.appendChild(name);
      main.appendChild(meta);

      const btn = document.createElement("button");
      btn.className = "file-btn";
      btn.textContent = "Download";
      btn.addEventListener("click", () => {
        window.location.href = `/api/download/${f.id}`;
      });

      card.appendChild(main);
      card.appendChild(btn);
      filesListEl.appendChild(card);
    });
}

async function loadFiles() {
  try {
    const res = await fetch("/api/files");
    const data = await res.json();
    renderFiles(data);
  } catch (err) {
    console.error(err);
  }
}

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove("dragover");
  });
});

dropArea.addEventListener("click", () => {
  fileInput.click();
});

dropArea.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  if (files && files.length) {
    uploadFiles(files);
  }
});

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files && files.length) {
    uploadFiles(files);
    fileInput.value = "";
  }
});

selectBtn.addEventListener("click", () => {
  fileInput.click();
});

async function uploadFiles(fileList) {
  const from =
    deviceInput.value.trim() || (navigator.userAgent.includes("Mobile") ? "Phone" : "PC");
  const filesArr = Array.from(fileList);

  for (const file of filesArr) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("from", from);

    statusEl.textContent = `Uploading ${file.name}...`;

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        console.error(data);
        statusEl.textContent = `Failed to upload ${file.name}`;
      } else {
        statusEl.textContent = `Uploaded ${file.name}`;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = `Error uploading ${file.name}`;
    }
  }

  setTimeout(() => {
    statusEl.textContent = "";
  }, 1500);
}

socket.on("file-added", (fileMeta) => {
  loadFiles();
});

loadFiles();
