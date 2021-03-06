# Stëmm

## Introduction
### Stëmm is a chrome extension that allows you to control Google Chrome using your voice.

Stëmm leverages the [Deepgram](https://docs.deepgram.com) API to convert your speech to voice commands that Stëmm executes in the background. It can create and remove tabs and windows (including incognito windows) as well as search for specific terms, open common websites and add to bookmarks.

## Installation
1. Obtain an API key from [Deepgram](https://docs.deepgram.com)
2. Create a new file called `config.js` and paste the following line: `globalThis.KEY = <YOUR_API_KEY>`
3. Open the extension *in developer mode* as an unpacked extension on `chrome://extensions`

## Commands

Function | Command
--- | ---
Create a new tab | Chrome open tab
Close the current tab | Chrome close tab
Open a new window | Chrome open window
Open a private browsing window | Chrome open incognito
Close a window | Chrome close window
Search on google | Chrome search for `<query>` OR google `<query>`
Open Netflix | Chrome open Netflix
Open GitHub | Chrome open GitHub
Open Instagram | Chrome open Instagram
Open Facebook | Chrome open Facebook
Bookmark the current tab | Chrome add to bookmarks
Open the manual page | Chrome open manual


## Tasks
- [ ] Write comments for all code
- [ ] Make the Devpost catchier?

---

### Bianca Sandu, Julius Weisser, Benedek Der, Siddharth Srivastava
