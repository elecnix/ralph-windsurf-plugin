const path = require("path");

const { runTests } = require("@vscode/test-electron");

const run = async () => {
  const extensionDevelopmentPath = path.resolve(__dirname, "..", "..");
  const extensionTestsPath = path.resolve(
    __dirname,
    "..",
    "..",
    "out",
    "test",
    "e2e",
    "suite",
    "index"
  );

  try {
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ["--disable-extensions"]
    });
  } catch (error) {
    console.error("Failed to run tests", error);
    process.exit(1);
  }
};

void run();
