const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

let files = [];

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/files", (req, res) => {
  res.json(files);
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  const from = req.body.from || "Unknown device";
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileMeta = {
    id: Date.now().toString() + Math.floor(Math.random() * 1000),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    from,
    time: new Date().toISOString(),
  };

  files.push(fileMeta);

  io.emit("file-added", fileMeta);

  res.json({ success: true, file: fileMeta });
});

app.get("/api/download/:id", (req, res) => {
  const { id } = req.params;
  const fileMeta = files.find((f) => f.id === id);

  if (!fileMeta) {
    return res.status(404).send("File not found");
  }

  const filePath = path.join(uploadsDir, fileMeta.storedName);
  res.download(filePath, fileMeta.originalName);
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Local sharing server is running at http://localhost:${PORT}`);
  console.log(
    `Open this in your browser. For phone, use LAN IP instead of localhost.`
  );
});
