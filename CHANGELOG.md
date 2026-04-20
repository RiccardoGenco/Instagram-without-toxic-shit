# Changelog

All notable changes to this project will be documented here.

## [1.0.0] — 2025-04-20

### Added
- `declarativeNetRequest` rules to redirect hard navigations to `/direct/inbox/`
- Content script intercepting `history.pushState` / `history.replaceState` for SPA navigation
- `popstate` listener to handle browser back/forward buttons
- CSS injection to visually disable non-chat navigation items
