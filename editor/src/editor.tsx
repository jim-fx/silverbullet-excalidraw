import React from "react";
import ReactDOM from "react-dom/client";
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./editor.css"
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/dist/types/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/dist/types/excalidraw/element/types";
import { SaveState } from "./types";

const syscall = window.silverbullet.syscall;

const root = ReactDOM.createRoot(document.getElementById("editor")!);

let fileName: string = "";
let returnLink: string = "";
const state = {} as SaveState;

async function save() {
  const serialized = serializeAsJSON(state.elements, state.appState, state.files, "local");
  const data = new TextEncoder().encode(serialized)
  globalThis.silverbullet.sendMessage("file-saved", { data });
}

function TopRightUI() {
  return <button
    className="button"
    onClick={() => {
      save().then(() => {
        if (returnLink) {
          syscall("editor.navigate", returnLink);
        } else {
          const path = fileName.split("/");
          if (path[path.length - 1].endsWith(".excalidraw")) {
            path.pop()
          }
          syscall("editor.navigate", path.join("/"));
        }
      })
    }}>Save and Exit</button>
}

function App({ doc, viewMode, darkMode }: { doc: ExcalidrawInitialDataState, darkMode: boolean, viewMode: boolean }) {

  function handleChange(elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) {
    state.elements = elements;
    state.appState = appState;
    state.files = files;
    globalThis.silverbullet.sendMessage("file-changed", {});
  }

  return (
    <div className={`excalidraw ${viewMode ? "excalidraw-viewer" : "excalidraw-editor"}`}>
      <Excalidraw
        onChange={viewMode ? () => { } : handleChange}
        initialData={doc}
        viewModeEnabled={viewMode}
        zenModeEnabled={viewMode}
        renderTopRightUI={TopRightUI}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveAsImage: false,
            saveToActiveFile: false,
          }
        }}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

async function open(data: Uint8Array) {
  fileName = await syscall("editor.getCurrentPage");
  const excalidrawContent = new TextDecoder().decode(data);
  const darkMode = await syscall("clientStore.get", "darkMode");
  returnLink = await syscall("clientStore.get", "excalidraw.returnLink");

  const doc = JSON.parse(excalidrawContent);

  const url = new URL(window.location);
  const viewMode = url.searchParams.get("viewer") === "true";

  root.render(<App doc={doc} darkMode={darkMode} viewMode={viewMode} />);
}



globalThis.silverbullet.addEventListener("file-open", (event) => open(event.detail.data));
globalThis.silverbullet.addEventListener("file-update", (event) => open(event.detail.data));
globalThis.silverbullet.addEventListener("request-save", () => save());

