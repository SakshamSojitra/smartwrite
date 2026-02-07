# SmartWrite - Node.js + React Version

Intelligent Grammar & Spell Checker built with **Node.js** (Express) and **React**.

---

## Project Structure

```
smartwrite/
├── server/                 # Node.js + Express backend
│   ├── index.js
│   └── package.json
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Header.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── TextEditor.jsx
│   │   │   ├── SuggestionPanel.jsx
│   │   │   ├── SuggestionCard.jsx
│   │   │   └── Tooltip.jsx
│   │   ├── utils/
│   │   │   └── textUtils.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README-REACT.md
```

---

## How to Run

### 1. Start the backend (Terminal 1)

```powershell
cd "d:\College\Free Time\smartwrite\server"
npm install
npm run dev
```

API runs at **http://127.0.0.1:5000**

### 2. Start the frontend (Terminal 2)

```powershell
cd "d:\College\Free Time\smartwrite\client"
npm install
npm run dev
```

React app runs at **http://localhost:3000**

### 3. Open in browser

Go to **http://localhost:3000** – the client proxies `/check` to the backend.

---

## Components Overview

| Component         | Purpose                                   |
|------------------|-------------------------------------------|
| **Header**       | Logo and tagline                          |
| **StatsBar**     | Word count, characters, readability, errors |
| **Button**       | Reusable primary/secondary buttons        |
| **TextEditor**   | Textarea with highlight overlay for errors |
| **SuggestionPanel** | Side panel with correction suggestions |
| **SuggestionCard**  | Single error + replacement chips         |
| **Tooltip**      | Hover suggestions over highlighted text   |

---

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React 18, Vite
- **NLP API**: LanguageTool (free, public)
- **Styling**: Custom CSS with variables

---

## Build for production

```powershell
cd client
npm run build
```

Output goes to `client/dist/`. Serve with any static file server, and ensure the backend runs separately or is deployed.
