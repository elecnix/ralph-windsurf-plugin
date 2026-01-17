import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

const CHANNEL_NAME = "Focus Tracker";
const LOG_FILE_NAME = "focus-tracker.log";

type FocusTarget = "textEditor" | "notebookEditor" | "terminal" | "unknown";

interface FocusTrackerApi {
  getLogFilePath: () => string;
}

let logFilePath = "";
let outputChannel: vscode.OutputChannel | undefined;

const formatTimestamp = () => new Date().toISOString();

const getFocusTarget = (): FocusTarget => {
  if (vscode.window.activeTerminal) {
    return "terminal";
  }

  if (vscode.window.activeNotebookEditor) {
    return "notebookEditor";
  }

  if (vscode.window.activeTextEditor) {
    return "textEditor";
  }

  return "unknown";
};

const writeLog = async (message: string): Promise<void> => {
  const timestamp = formatTimestamp();
  const entry = `[${timestamp}] ${message}`;

  outputChannel?.appendLine(entry);

  if (!logFilePath) {
    return;
  }

  await fs.appendFile(logFilePath, `${entry}\n`);
};

const logFocusState = async (reason: string): Promise<void> => {
  const focusTarget = getFocusTarget();
  const windowFocused = vscode.window.state.focused;
  const windowActive = vscode.window.state.active;

  await writeLog(
    `reason=${reason} focus=${focusTarget} windowFocused=${windowFocused} windowActive=${windowActive}`
  );
};

export const activate = async (context: vscode.ExtensionContext): Promise<FocusTrackerApi> => {
  outputChannel = vscode.window.createOutputChannel(CHANNEL_NAME);
  outputChannel.show(true);

  await fs.mkdir(context.globalStorageUri.fsPath, { recursive: true });
  logFilePath = path.join(context.globalStorageUri.fsPath, LOG_FILE_NAME);

  await writeLog(`logFilePath=${logFilePath}`);
  await logFocusState("activate");

  context.subscriptions.push(
    outputChannel,
    vscode.window.onDidChangeActiveTextEditor(() => {
      void logFocusState("activeTextEditor");
    }),
    vscode.window.onDidChangeActiveNotebookEditor(() => {
      void logFocusState("activeNotebookEditor");
    }),
    vscode.window.onDidChangeActiveTerminal(() => {
      void logFocusState("activeTerminal");
    }),
    vscode.window.onDidChangeWindowState(() => {
      void logFocusState("windowState");
    })
  );

  return {
    getLogFilePath: () => logFilePath
  };
};

export const deactivate = (): void => {
  outputChannel?.dispose();
  outputChannel = undefined;
};
