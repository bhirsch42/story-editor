import * as vscode from 'vscode';

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
    console.log("GET HTML FOR WEBVIEW");
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Cat Scratch</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
      </body>
      </html>
    `;
  }
}
