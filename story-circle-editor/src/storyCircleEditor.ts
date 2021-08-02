import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
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
    console.log("GET HTML FOR WEBVIEW");
    let html = fs.readFileSync('./src/app/index.html').toString();
    const $ = cheerio.load(html);

    // console.log($.html());

    $('script').each((_i, el: any) => {
      if ($(el).attr('src')) {
        console.log("HELLO", $(el).attr('src'))
        const uri = vscode.Uri.file(
          path.join(this.context.extensionPath, `/src/app${$(el).attr('src')}`)
        );
  
        $(el).attr('src', webview.asWebviewUri(uri).toString());  
      }
    });

    console.log($.html());

    return $.html();
  }
}
