import * as assert from "assert";
import * as fs from "fs/promises";
import Mocha from "mocha";
import * as vscode from "vscode";

type FocusTrackerApi = {
  getLogFilePath: () => string;
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const registerTests = (): void => {
  describe("Focus Tracker", () => {
    it("logs focus changes", async () => {
      const extension = vscode.extensions.getExtension<FocusTrackerApi>("ralph.vscode-focus-tracker");
      assert.ok(extension, "Extension was not found");

      const api = await extension.activate();
      const logFilePath = api.getLogFilePath();

      const doc = await vscode.workspace.openTextDocument({ content: "Focus tracker test" });
      await vscode.window.showTextDocument(doc, { preview: false });

      const terminal = vscode.window.createTerminal("Focus Tracker Terminal");
      terminal.show();

      await delay(1000);

      const logContents = await fs.readFile(logFilePath, "utf8");
      console.log("Focus Tracker log contents:\n" + logContents);

      assert.ok(logContents.includes("focus="), "Expected focus logs to be present");

      terminal.dispose();
    });
  });
};

export const run = (): Promise<void> => {
  const mocha = new Mocha({
    ui: "bdd",
    color: true
  });

  return new Promise((resolve, reject) => {
    mocha.suite.emit("pre-require", globalThis, "nofile", mocha);
    registerTests();

    mocha.run((failures: number) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`));
        return;
      }

      resolve();
    });
  });
};
