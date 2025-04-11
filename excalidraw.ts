import {
  asset,
  clientStore,
  editor as sbEditor,
  space,
} from "@silverbulletmd/silverbullet/syscalls";

export async function editor(): Promise<{ html: string; script: string }> {
  const editorJs = await asset.readAsset("excalidraw", "dist/editor.js");
  const editorCss = await asset.readAsset("excalidraw", "dist/editor.css");
  return {
    html: `<style>${editorCss}</style><div id="editor"></div>`,
    script: editorJs,
  };
}

export async function widget(
  fileName: string,
): Promise<{ html: string; script: string }> {
  const [widgetJs, widgetCss, excalidrawContent, darkMode] = await Promise.all([
    asset.readAsset("excalidraw", "dist/widget.js"),
    asset.readAsset("excalidraw", "dist/widget.css"),
    space.readAttachment(fileName),
    clientStore.get("darkMode"),
  ]);

  const text = new TextDecoder().decode(excalidrawContent);

  return {
    html:
      `<script type="application/json" id="excalidraw-content">${text}</script>
<style>${widgetCss}</style>
<div id="widget" data-filename="${fileName}" data-darkmode=${darkMode} />`,
    script: widgetJs,
  };
}

export async function createDiagram() {
  let diagramName = await sbEditor.prompt("Enter a diagram name: ", "Diagram");
  diagramName = diagramName.trim().replace(/\.excalidraw$/, "");

  const pageName = await sbEditor.getCurrentPage();
  const directory = pageName.substring(0, pageName.lastIndexOf("/"));
  const filePath = (directory + "/" + diagramName + ".excalidraw").replace(
    /^\//,
    "",
  );

  const fileExists = await space.fileExists(filePath);
  if (fileExists) {
    const overwrite = await sbEditor.confirm(
      "File already exist! Do you want to overwrite?",
    );
    if (!overwrite) {
      return false;
    }
  }

  const fileContent = new TextEncoder().encode(
    `{"type":"excalidraw","version":2,"elements":[],"appState":{},"files":{}}`,
  );
  await space.writeFile(filePath, fileContent);

  const codeBlock = `\`\`\`excalidraw
${filePath}
\`\`\``;
  await sbEditor.insertAtCursor(codeBlock);
}
