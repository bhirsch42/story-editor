import * as vscode from 'vscode';
import * as path from 'path';

export class StoryCircleEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new StoryCircleEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(StoryCircleEditorProvider.viewType, provider);
    return providerRegistration;
  }

  private static readonly viewType = 'story-circle-editor.storyCircleEditor';

  constructor(
    private readonly context: vscode.ExtensionContext
  ) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: 'update',
        text: document.getText(),
      });
    }

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    webviewPanel.webview.onDidReceiveMessage(e => {
      console.log("received message", e);
    });

    let orange = vscode.window.createOutputChannel("Orange");
    orange.appendLine("I am a banana.");
    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const configJson = JSON.stringify({});

    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this.context.extensionPath, "dist", "app.js")
    );

    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Config View</title>

          <meta http-equiv="Content-Security-Policy"
                content="default-src 'none';
                        img-src https:;
                        script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                        style-src vscode-resource: 'unsafe-inline';">

          <script>
            window.acquireVsCodeApi = acquireVsCodeApi;
            window.initialData = ${configJson};
          </script>
      </head>
      <body>
          <div id="root"></div>

          <script src="${reactAppUri}"></script>
      </body>
      </html>
    `;
  }
}
