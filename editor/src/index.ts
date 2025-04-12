import { renderEditor } from "./editor";
import { renderWidget } from "./widget";

(function init() {

  const editorElement = document.getElementById('editor');
  const widgetElement = document.getElementById('widget');
  console.log({ widgetElement, editorElement });

  if (editorElement) {
    renderEditor(editorElement);
  } else if (widgetElement) {
    renderWidget(widgetElement);
  } else {
    console.error("Excalidraw: No editor or widget element found");
  }

})()
