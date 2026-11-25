# Kindle Bulk Add to Collection
[![GitHub Release](https://img.shields.io/github/v/release/zahroc/kindle-bulk-add-to-collection)](https://github.com/zahroc/kindle-bulk-add-to-collection/releases/latest)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install-green)](https://greasyfork.org/en/scripts/607180-kindle-bulk-add-to-collection)
[![License](https://img.shields.io/github/license/zahroc/kindle-bulk-add-to-collection)](https://github.com/zahroc/kindle-bulk-add-to-collection/blob/main/LICENSE)
[![Greasy Fork Installs](https://img.shields.io/greasyfork/dt/607180)](https://greasyfork.org/en/scripts/607180-kindle-bulk-add-to-collection/stats)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-black)
![Firefox](https://img.shields.io/badge/Firefox-Tested-orange)
![Development](https://img.shields.io/badge/Development-Vibe%20Coding-purple)

A free Tampermonkey userscript for adding Amazon Kindle books to an existing collection in batches. The original v1.5 automation was successfully used on a library of 3,070 books in Firefox.

## Development Story

This project was created using AI-assisted development, commonly referred to as **vibe coding**, in collaboration with OpenAI's ChatGPT.

The project originated from a real-world need to organize a personal Amazon Kindle library containing more than 3,000 books without manually processing hundreds of pages.

Development involved iterative coding, browser DOM inspection, troubleshooting, real-world testing, and refinement based on actual results.

The original v1.5 automation engine successfully processed all 3,070 Kindle books across 123 pages.

This project demonstrates how human problem-solving, AI-assisted programming, and practical testing can turn a repetitive manual task into a useful open-source application.

**Project creator and maintainer:** zahroc  
**AI development assistant:** OpenAI ChatGPT

## Installation

### Prerequisites

- Firefox web browser (tested)
- Tampermonkey browser extension
- An Amazon.com account
- An existing Kindle collection

### Option 1 — Greasy Fork (Recommended)

[Install from Greasy Fork](https://greasyfork.org/en/scripts/607180-kindle-bulk-add-to-collection)

Click Install and confirm the installation in Tampermonkey.

### Option 2 — GitHub

[Install directly from GitHub](https://raw.githubusercontent.com/zahroc/kindle-bulk-add-to-collection/main/KindleBulkAddToCollection.user.js)

### Option 3 — Manual Installation

Download the userscript from the
[latest GitHub release](https://github.com/zahroc/kindle-bulk-add-to-collection/releases/latest)
and import it into Tampermonkey.

### Getting Started

1. Sign into your Amazon account.
2. Open Manage Your Content and Devices.
3. Navigate to your Kindle books.
4. Enter the exact name of an existing collection.
5. Run in Preview mode first.
6. Disable Preview mode when ready.
7. Enable automatic page advancement if desired.
8. Click Start / Resume.

## Features

- Bulk selection and automatic pagination (25 books per page in the tested interface).
- Amazon success message count verification and automatic notification dismissal.
- Adjustable delays, pause/continue, stop, and local progress checkpoints.
- Exact collection name matching and checks for unexpected changes to other checkbox states.

## Troubleshooting and limitations

- Firefox and Amazon.com were tested; other browsers, regions and layouts are unverified.
- If the panel is absent, check that Tampermonkey is enabled and the URL contains `/contentlist/booksAll/`.
- If stopped, inspect Amazon before retrying. Close any existing notification or dialog manually. Navigate to the desired page before resuming; checkpoints do not navigate automatically.
- A success message confirms Amazon reported a batch addition, not an independent audit of each title or other collection memberships. Verify collection contents afterward.
- The script stops on unexpected controls, counts, or checkbox states. Amazon interface changes may break it. Do not bypass account restrictions or rate limits; review applicable Amazon terms before use.
- No external data transmission is implemented. The collection name and latest confirmed batch are stored in browser localStorage. Disable the script when not in use.
- This is an independent community project, not affiliated with Amazon. Use at your own risk.

## License

MIT (see LICENSE).
