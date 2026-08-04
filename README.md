# Bag Picker

A random selection manager for picking one person from a Conductor list and one from a VIP list. Supports multiple admins, tracks a full pick history, and persists all data in JSONBin (no database needed).

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [JSONBin.io](https://jsonbin.io) account (free tier is enough)

### Install and run locally

```bash
cd bag-picker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

In local development, the app uses `localStorage` instead of JSONBin — no API keys needed. Admins are read from `src/data/admins.js`. A yellow **LOCAL ONLY** banner is shown at the top of the page as a reminder that changes are not persisted to JSONBin.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The `vercel.json` at the root handles SPA routing automatically.

---

## JSONBin Setup

All production data is stored across three JSONBin bins. Create each one in the JSONBin dashboard, then set the corresponding environment variables.

### Bin 1 — State (persons + current pick)

Initial content:
```json
{
  "persons": [],
  "lastPick": null
}
```
> On first load the app detects an empty `persons` array and seeds the bin from `src/data/initialData.js`. After that, JSONBin is the source of truth — edits made in the app (add person, move, reset, etc.) are written here.

### Bin 2 — History (pick log)

Initial content:
```json
{ "log": [] }
```
> A new entry is appended every time **Mark as Used** is clicked. Never overwritten by Reset or Swap.

### Bin 3 — Admins

Initial content:
```json
{
  "admins": [
    { "name": "YourName", "hash": "<md5 of your secret code>" }
  ]
}
```
> To generate a hash: go to [md5hashgenerator.com](https://www.md5hashgenerator.com) and hash your chosen code. Add one object per admin. To add or remove admins later, edit this bin directly in JSONBin — no code change or redeployment needed.

---

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Under **Settings → Environment Variables**, add the following:

| Variable | Value |
|----------|-------|
| `JSONBIN_API_KEY` | Your JSONBin Master Key (Account → Master Key) |
| `JSONBIN_STATE_BIN_ID` | Bin ID of the state bin |
| `JSONBIN_HISTORY_BIN_ID` | Bin ID of the history bin |
| `JSONBIN_ADMINS_BIN_ID` | Bin ID of the admins bin |

4. Deploy. The serverless functions in `api/` act as a proxy so the API key never reaches the browser.

---

## Local Testing with the Full API Stack

To test JSONBin integration locally (instead of localStorage):

```bash
# One-time setup
npm install -g vercel
vercel login
vercel link   # link to your Vercel project

# Copy and fill in the env template
cp .env.local.example .env.local
# edit .env.local with your real keys

# Run with both the Vite dev server and the serverless functions
vercel dev
```

---

## Features

### Bags

There are four bags:

| Bag | Colour | Purpose |
|-----|--------|---------|
| **Conductor** | Blue | Primary pool for picking |
| **VIP** | Amber | Secondary pool for picking |
| **Used** | Gray | People already picked this round |
| **Inactive** | Slate | Excluded from all picks |

Each person has a **home bag** (Conductor or VIP) which determines where they return on Reset.

---

### Available to everyone

#### Pick Random
Randomly selects one person from Conductor and one from VIP. The pair is highlighted in the bag columns and shown in the **Current Pick** banner. Picking again replaces the previous pick without marking it as used.

#### Pick History
Collapsible panel at the bottom showing every marked pick in reverse-chronological order. Each entry shows the Conductor name, VIP name, date/time, and which admin marked it.

---

### Admin-only actions

Click **Admin Login** in the top-right corner and enter your secret code.

#### Mark as Used
Moves the currently picked pair to the **Used** bag and records the pick in the history (with timestamp and admin name).

#### Reset
Moves everyone from Used back to their home bag. People in Inactive are not affected. Asks for confirmation.

#### Swap Lists
Resets everyone and swaps home assignments — Conductors become VIPs and vice versa. Useful for alternating roles between sessions. Asks for confirmation.

#### Add Person
Enter a name and choose a bag. New persons added via the app are saved directly to JSONBin (not to `initialData.js`).

#### Move Person
In admin mode, each person card shows a **move** link. Clicking it opens a dialog to move them to any other bag. Moving someone to Conductor or VIP also updates their home bag. If a currently-picked person is moved, the Current Pick is cleared.

#### Manual Entry
Records a past pick that was never logged at the time. Opens a dialog with a Conductor dropdown, a VIP dropdown (both filtered by home bag, with current bag status shown), and a date/time picker defaulting to now. On submit, both people are moved to Used and a history entry is created with the chosen timestamp. Manual entries are marked with a **manual** badge in Pick History. The full history is re-sorted by timestamp after insertion so past-dated entries appear in the correct position.

---

## Admin Mode

Admin mode is session-only — a page refresh requires logging in again.

The login modal accepts a secret code. The browser computes `md5(code)` and compares it against the hashes fetched from the admins bin. No plain-text codes are stored anywhere in the source or in JSONBin.

To add or remove admins, edit the admins bin in JSONBin directly. No redeployment needed.

To log out, click **Exit Admin** in the header.

---

## How Data Flows

```
Browser (React)
  │
  ├─ GET/PUT /api/state   →  api/state.js   →  JSONBin state bin
  ├─ GET/PUT /api/picks   →  api/picks.js   →  JSONBin history bin
  └─ GET     /api/admins  →  api/admins.js  →  JSONBin admins bin
```

The serverless functions (`api/`) run on Vercel's infrastructure. The `JSONBIN_API_KEY` lives only in Vercel environment variables and is never included in the JavaScript bundle served to the browser.

In local development (`npm run dev`), the `/api/*` endpoints do not exist — the app falls back to `localStorage` for state/history and `src/data/admins.js` for admins.

---

## Project Structure

```
api/
  state.js                 # Serverless proxy — state bin (persons + lastPick)
  picks.js                 # Serverless proxy — history bin (log)
  admins.js                # Serverless proxy — admins bin (read-only)
src/
  App.jsx                  # Root component
  data/
    initialData.js         # Seed data — used only when state bin is empty
    admins.js              # Local admin list — used only in development
  hooks/
    useBags.js             # Bag state, all actions, JSONBin persistence
    useAdmin.js            # Admin auth, loads admins from JSONBin in production
  utils/
    md5.js                 # Self-contained MD5 (no external dependency)
    storage.js             # All JSONBin and localStorage read/write logic
  components/
    Header.jsx             # Title bar + admin login/logout
    ActionBar.jsx          # Top button row
    PickDisplay.jsx        # Current pick banner
    BagsGrid.jsx           # Four-column bag layout
    BagColumn.jsx          # Single bag with person cards
    PickHistory.jsx        # Collapsible pick history panel
    AdminLoginModal.jsx    # Secret code entry dialog
    MovePersonModal.jsx    # Move a person between bags
    AddPersonModal.jsx     # Add a new person
    ManualPickModal.jsx    # Retroactively record a past pick
.env.local.example         # Template for local environment variables
vercel.json                # SPA routing config
```
