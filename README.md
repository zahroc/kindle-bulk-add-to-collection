# Kindle Bulk Add to Collection

A free Tampermonkey userscript for adding Amazon Kindle books to an existing collection in batches. The original v1.5 automation was successfully used on a library of 3,070 books in Firefox.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. [Install the userscript](https://raw.githubusercontent.com/zahroc/kindle-bulk-add-to-collection/main/KindleBulkAddToCollection.user.js) and approve installation.
3. Open [Amazon US — Manage Your Books](https://www.amazon.com/hz/mycd/digital-console/contentlist/booksAll/dateDsc/).
4. Create your destination collection in Amazon first, if necessary. Refresh the books page and enter its exact name in the floating panel.
5. Leave **Preview only** checked and click **Start / Resume**. No collection changes are saved in preview mode.
6. Uncheck preview and leave automatic advancement unchecked to test one page. Confirm the prompt and verify the actual collection contents.
7. Navigate to the next unprocessed page, enable automatic advancement and start again. Monitor the first few batches.

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
