# Chrome ArtNet App

A Chrome App that bridges ArtNet UDP packets into Chrome's application environment.

## Background: Chrome Security and UDP

Regular Chrome extensions and web pages are sandboxed from raw network access — they cannot open UDP sockets. Chrome Apps (a distinct platform from extensions) have access to a lower-level `chrome.sockets.udp` API that bypasses this restriction, but only when the manifest explicitly declares socket permissions.

This is a **"unsafe"** or developer-mode-only app: it must be loaded as an unpacked extension and cannot be published to the Chrome Web Store in this form due to the broad socket permissions it requires.

## Capabilities

**Can do:**
- Bind a UDP socket to port 6577 on all interfaces (`0.0.0.0`)
- Receive incoming UDP packets and log their contents to the background page console
- Open a simple UI window when launched

**Cannot do (not implemented):**
- Send UDP packets — the manifest grants `"send": "*"` permission, so Chrome would allow it, but no send code is written
- Forward received data to the UI window — the background script logs to console only, it does not pass data to `window.html` via `chrome.runtime.sendMessage`
- Parse actual ArtNet protocol frames — received bytes are decoded as UTF-8 text, which will corrupt the binary ArtNet packet structure

**Note on the ArtNet port:** The standard ArtNet port is 6454. This app binds to port 6577, which may need adjustment depending on what is sending on the network.

## Limitations

Chrome Apps were deprecated and removed from desktop Chrome around 2022 (they continue to run on ChromeOS). This code requires an older Chrome version or ChromeOS, and uses Manifest V2 (which predates promise/async-await support in the Chrome Apps API).

## Installation

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked** (top left)
4. Select this folder

Once loaded, open the background page console from the app card to see incoming UDP data logged.

## Testing

Send test data with netcat:

```sh
echo "hi" | netcat -uc localhost 6577
```

## Manifest Permissions

```json
"sockets": {
  "udp": {
    "send": "*",
    "bind": "*"
  }
}
```

These grant unrestricted UDP send and bind to any IP/port combination.
