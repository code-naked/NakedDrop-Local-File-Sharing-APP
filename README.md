# LocalShare (NakedDrop) 🚀  
Local Wi-Fi File Sharing Web App

LocalShare is a real-time local network file sharing app that lets you instantly transfer files between devices connected to the same Wi-Fi network.  
No cloud, no login, no internet — just fast local transfers in your browser.

You can drag & drop files on your PC and download them instantly on your phone.

---

## ✨ Features

- Real-time file sharing using Socket.IO  
- Drag & drop uploads  
- Works on PC, phone, tablet  
- No cloud services  
- No accounts or authentication  
- Files stored locally  
- Instant sync across all devices on the same Wi-Fi  

---

## 🛠️ Requirements

Make sure you have the following installed:

- Node.js
- NPM
- Devices connected to the same Wi-Fi network

Check your versions:

```bash
node -v
npm -v
```

## 📁 Project Structure

```bash
localshare/
│ server.js
│ package.json
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── uploads/   (auto-created)
```
## ⚙️ Installation

Open the project folder in VS Code or a terminal.

Initialize the project:
```bash
npm init -y
```

Install dependencies:
```bash
npm install express socket.io multer
```

## ▶️ Run the Project

Start the server:
```bash
node server.js
```

You should see:
```bash
LocalShare server running at http://localhost:3000
```

Open in browser:
```bash
http://localhost:3000
```

## 📱 Use on Phone

Make sure your phone is on the same Wi-Fi as your PC.

Find your PC’s local IP:
```bash
ipconfig
```

Example:
```bash
IPv4 Address: 192.168.0.5
```

Open on your phone:
```bash
http://192.168.0.5:3000
```
## 📤 Uploading Files

Enter your device name

Drag & drop a file into the upload box

Upload starts instantly

File appears for all connected devices

## 📥 Downloading Files

Any connected device can see shared files

Tap Download

File downloads instantly

## 🔁 Real-Time Sync

All clients sync instantly using Socket.IO.
No refresh needed.

## 🔒 Notes

Files are stored locally on the host machine

Memory resets when the server restarts

Intended for local network use only
