# Instagram Chat Only — Chrome Extension

> A minimal Chrome extension that locks Instagram to the Direct Messages inbox, blocking all other sections (feed, reels, stories, explore, profile).

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License MIT](https://img.shields.io/badge/License-MIT-blue)

---

## The Problem

Instagram's feed, reels, and stories are designed to grab your attention. Sometimes you just need to send a message — but end up scrolling for 30 minutes instead.

## The Solution

This extension enforces a single rule: **you can only visit `/direct/`**. Everything else redirects to the inbox automatically, both on page load and during in-app navigation.

---

## Features

- Redirects `instagram.com` and all sub-pages to `/direct/inbox/` on load
- Intercepts **client-side SPA navigation** (React Router / History API) — clicking "Home", "Reels", or "Explore" bounces you back instantly
- Handles browser back/forward buttons
- Visually disables non-chat navigation items via injected CSS
- Zero tracking, zero remote requests, zero storage — fully offline

---

## How It Works

Instagram is a React single-page application. URL changes happen via the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) (`pushState` / `replaceState`) without triggering a new network request. A pure network-level blocker won't catch those.

This extension uses two complementary layers:

| Layer | Mechanism | Catches |
|-------|-----------|---------|
| Network | `declarativeNetRequest` rules | Hard navigations (typing a URL, external links) |
| Runtime | Content script overriding `history.pushState` / `replaceState` | In-app SPA navigation |

```
User clicks "Home"
       │
       ▼
history.pushState("/")   ← overridden by content.js
       │
       ▼
redirectIfNeeded()       ← pathname doesn't start with /direct/
       │
       ▼
location.replace("/direct/inbox/")
```

---

## Installation

> The extension is not published on the Chrome Web Store. Install it in Developer Mode.

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Open [instagram.com](https://www.instagram.com) — you'll be redirected to the inbox

To temporarily disable it, toggle it off from `chrome://extensions/`.

---

## Project Structure

```
instagram-chat-only/
├── manifest.json      # Extension manifest (Manifest V3)
├── rules.json         # declarativeNetRequest rules (network layer)
├── content.js         # Content script (SPA navigation layer)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── CHANGELOG.md
└── README.md
```

---

## Technical Details

### `manifest.json`
Declares the extension using **Manifest V3**, the current Chrome extension standard. Uses `declarativeNetRequest` for network-level rules and a content script injected at `document_start` for early interception.

### `rules.json`
Two rules with different priorities:
- **Priority 2 — allow**: Permits any `main_frame` navigation matching `instagram.com/direct/`
- **Priority 1 — redirect**: Redirects everything else to `/direct/inbox/`

`resourceTypes: ["main_frame"]` ensures only top-level page navigations are affected — API calls, images, scripts, and XHR requests are untouched.

### `content.js`
Wraps `history.pushState` and `history.replaceState` to intercept every URL change made by Instagram's React frontend. Also listens for `popstate` (back/forward) and runs an immediate check at script injection time (`document_start`).

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.
