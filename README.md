# 🔍 Campus Lost & Found System
### *Centralized Smart University Asset Recovery Platform*

[![Status](https://img.shields.io/badge/Status-Active%20Deployment-success?style=flat-square)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20htm-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![CSS3](https://img.shields.io/badge/Design%20System-Vanilla%20CSS%20Collegiate-2563eb?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Security](https://img.shields.io/badge/Security-Strict%20CSP%20%2B%20SSO-10b981?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
[![Platform](https://img.shields.io/badge/Platform-Zero--Build%20ES%20Modules-f59e0b?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

A responsive, mobile-first, and zero-training digital lost-and-found platform engineered for university campuses. It replaces slow, fragmented word-of-mouth recovery processes with automated AI matching, physical locker tracking, and secure cryptographic QR-code pickup verification.

---

## 👥 Development Team & Credits

This project was designed, architected, and built by:

| Developer | Role | Responsibilities |
|---|---|---|
| **👑 Vladimir Tadeo** | **Team Leader & System Architect** | Project leadership, system architecture, matching logic, and security compliance. |
| **John Mark Robles** | **Fullstack & State Engineer** | State management, sub-2s search optimization, inventory data models, and persistence. |
| **Justin Leonen** | **UI/UX & Frontend Specialist** | Mobile-first collegiate design system, QR verification modals, accessibility (WCAG 2.2 AA), and sound engine. |

### 🌟 Project Framework & Kit Credits
This project was scaffolded and accelerated using the **[`devcon-agent-kit-codecamp`](https://github.com/szndy/devcon-agent-kit-codecamp)** framework.
- **Original Author / Repository Owner:** [szndy](https://github.com/szndy)
- **Framework:** DEVCON Jumpstart Agent Kit — empowering rapid, model-agnostic AI agent workflows and full-lifecycle product jumpstarting.

---

## 🚀 Key Features

### 1. 🔐 Verified Campus Email Authentication & Role Gateway
- **Domain Restricted:** Exclusively permits sign-ins from verified university domains (e.g. `@university.edu`, `@campus.edu`, `@alumni.edu`).
- **Interactive Dual-Role Switcher:** Easily toggle between **🎓 Student / Faculty** and **🛡️ Campus Security Admin** modes for live testing and administrative oversight.

### 2. ⚡ Real-Time Auto-Match Notification Alerts
- **Smart Similarity Matching:** Automatically analyzes newly logged found items against open lost reports.
- **Instant Confidence Banner:** Alerts students when a match is detected (e.g. *96% AI Similarity Match*) with side-by-side comparison review.

### 3. 🔴 "Report Lost Item" Form
- Fast submission interface capturing item title, category, campus building location, date & time, detailed description, and unique distinguishing marks/serial numbers.
- Integrated cloud transmission loading states.

### 4. 🟢 "Report Found Item" Form with Photo Upload
- **Interactive Drag-and-Drop Photo Dropzone:** Instant image preview with file validation and compression simulation.
- **Physical Custody Drop-off Allocation:** Directly logs the secure physical storage locker (e.g., *Campus Security Desk HQ Locker #12*, *Library Bin A*).

### 5. 🔍 Sub-2-Second Search & Multi-Faceted Inventory Gallery
- **Instant Debounced Search:** Query across thousands of items by name, description, campus building, or item ID (`LF-XXXX` / `FD-XXXX`).
- **Multi-Category Filter Chips:** Filter by item status (*All, 🔴 Lost, 🟢 Found, ⚡ Matched, ✓ Returned*), categories, locations, and date sorting.

### 6. 🎟️ Claim Verification & Dynamic QR-Code Pickup Pass
- **Ownership Verification:** Requires claimants to provide identifying details (e.g., lockscreen wallpaper, distinguishing scratches, or passcode confirmation).
- **Dynamic Cryptographic SVG QR-Code:** Generates an on-screen digital voucher for physical handover verification at the Campus Security Desk.

### 7. 🛡️ Security / Admin Custody Portal
- **Physical Locker Inventory Ledger:** Tracks asset custody status, drop-off officer logs, and locker allocations.
- **One-Click Handover Verification:** Enables campus security officers to verify QR codes and mark items as *Returned & Closed*.

### 8. 🎵 Zero-Dependency Web Audio Synthesizer Engine
- Built-in procedural audio engine (`soundEngine.js`) synthesizing chimes, alerts, and interaction feedback using the native Web Audio API with zero external audio assets.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core:** [React 18](https://react.dev/) + [`htm`](https://github.com/developit/htm) (Zero-build native ES Modules loaded via [`esm.sh`](https://esm.sh)).
- **Styling:** Vanilla CSS3 with Collegiate Design Tokens, Glassmorphism, and full mobile-first responsiveness.
- **Sound Synthesis:** Web Audio API Procedural Synthesizer (`soundEngine.js`).
- **Local Web Servers:** Native PowerShell HTTP/HTTPS socket servers (`server.ps1`, `server_https.ps1`).
- **Data Persistence:** Client-side sanitized `localStorage` with prototype-pollution defense.

---

## 📂 Directory Structure

```text
devcon-agent-kit-codecamp/
├── index.html            # Main HTML entrypoint with strict CSP headers
├── app.js                # React 18 application with htm template literals & state engine
├── styles.css            # Collegiate design system & responsive layout stylesheets
├── soundEngine.js        # Procedural Web Audio API sound synthesizer
├── server.ps1            # High-reliability native HTTP static server (TcpListener)
├── server_https.ps1      # Native HTTPS static server with TLS certificate handling
├── start.bat             # 1-Click launcher script for Windows
├── generate_cert.ps1     # Self-signed TLS certificate generation script
├── test_https.ps1        # HTTPS endpoint automated test suite
├── test_security.ps1     # Path traversal and security regression test suite
└── README.md             # Project documentation & GitHub homepage
```

---

## 🚦 Getting Started & Running Locally

### Option A: 1-Click Launch (Recommended)
1. Double-click **`start.bat`** in the project folder.
2. The server will start automatically and launch your default browser (Brave, Chrome, or Edge) to:
   ```text
   http://localhost:5173
   ```

### Option B: PowerShell Command Line
1. Open PowerShell in the project directory:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
2. Navigate to `http://localhost:5173` in your browser.

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---|---|---|
| **Brave** | ✅ 100% | Works seamlessly. If aggressive shields are enabled, keep Web Audio & standard scripts allowed on `localhost`. |
| **Google Chrome** | ✅ 100% | Full support for ES Modules, Web Audio API, and local storage. |
| **Microsoft Edge** | ✅ 100% | Full support across all views and modals. |
| **Mozilla Firefox** | ✅ 100% | Fully compatible with responsive views and SVG QR rendering. |
| **Safari / Mobile** | ✅ 100% | Mobile-first viewport optimized for iOS and Android devices. |

---

## 🔒 Security & Privacy Features

- **Strict Content Security Policy (CSP):** Restricts script and connection execution to trusted domains (`'self'`, `https://esm.sh`, `https://fonts.googleapis.com`).
- **Directory Traversal Defense:** Both `server.ps1` and `server_https.ps1` enforce path normalization (`GetFullPath`) and isolate requests within the root folder.
- **Input Sanitization:** Strips non-printable ASCII control characters and prevents XSS/script injection in form submissions.
- **Prototype Pollution Protection:** Safe `JSON.parse` wrapper stripping `__proto__`, `constructor`, and `prototype` keys from local storage.

---

## 📄 License & Acknowledgments

- Developed for the **DEVCON Agent Kit Codecamp 2026**.
- Credits to **[szndy](https://github.com/szndy)** for the **[devcon-agent-kit-codecamp](https://github.com/szndy/devcon-agent-kit-codecamp)** foundation.
- Built with ❤️ by **Vladimir Tadeo**, **John Mark Robles**, and **Justin Leonen**.
