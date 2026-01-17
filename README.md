# Visual Studio Code Focus Tracker

This repository contains a Visual Studio Code extension that logs which Visual Studio Code component has keyboard focus. Logs appear in the Output panel and are also written to a log file in the extension global storage directory.

## Setup

1. Install dependencies:

   ```bash
   npm install --no-fund --no-audit
   ```

2. Build the extension:

   ```bash
   npm run build
   ```

3. Run lint checks:

   ```bash
   npm run lint
   ```

4. Run the test suite:

   ```bash
   npm test
   ```

## Running the extension locally

Use the Visual Studio Code command line interface to launch a development instance:

```bash
code --extensionDevelopmentPath="$(pwd)"
```

Open the Output panel and select `Focus Tracker` from the channel list to view logs. The extension also writes a log file and prints its location in the Output channel after activation.

## End-to-end test

Run the end-to-end test that launches Visual Studio Code and prints the latest focus logs to the console:

```bash
node test/e2e/runTests.js
```
