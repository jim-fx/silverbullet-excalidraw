import React from "react";
import ReactDOM from "react-dom/client";
import "@excalidraw/excalidraw/index.css";
import "./widget.css"
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/dist/types/excalidraw/types";
import { Excalidraw } from "@excalidraw/excalidraw";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/dist/types/excalidraw/element/types";
import { SaveState } from "./types";
import { debounce } from "./helpers";

function save(filePath: string, state: SaveState) {
  const code = new TextEncoder().encode(JSON.stringify(state))
  syscall("space.writeFile", filePath, code)
}

function App({ doc, filePath, darkMode }: { doc: ExcalidrawInitialDataState, filePath: string, darkMode: boolean }) {

  const [isEditing, setIsEditing] = React.useState(false);
  const [debouncedSave] = debounce(() => save(filePath, state.current), 500);

  const state = React.useRef({
    elements: [] as readonly OrderedExcalidrawElement[],
    appState: {} as AppState,
    files: {} as BinaryFiles,
  })

  function onChange(elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) {
    state.current.elements = elements;
    state.current.appState = appState;
    state.current.appState.collaborators = [] as any;
    state.current.files = files;
    debouncedSave();
  }

  function startEditing() {
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
    save(filePath, state.current)
  }

  function openFullScreen() {
    syscall("editor.navigate", filePath)
  }

  return <div className={isEditing ? "excalidraw-editor" : "excalidraw-viewer"}>
    <Excalidraw
      isCollaborating={false}
      initialData={doc}
      onChange={onChange}
      viewModeEnabled={!isEditing}
      theme={darkMode ? "dark" : "light"}
      UIOptions={{
        canvasActions: {
          loadScene: false,
          saveAsImage: false,
          saveToActiveFile: false,
        }
      }}
      renderTopRightUI={isEditing
        ? () => <button className="button" id="exit-button" onClick={stopEditing}>Exit</button>
        : () => null}
    >
      {!isEditing && <button className="button" id="edit-button" onClick={startEditing}>Edit</button>}
      {isEditing && <button className="button" id="edit-fullscreen" onClick={openFullScreen}>Fullscreen</button>}
    </Excalidraw>
  </div>
}


export function renderWidget(rootElement: HTMLElement) {
  const root = ReactDOM.createRoot(rootElement);
  const fileName = rootElement.dataset.filename!;
  const fileContent = (document.querySelector("#excalidraw-content") as HTMLElement).innerText;
  const darkMode = rootElement.dataset.darkmode === "true";
  const doc = JSON.parse(fileContent)
  root.render(<App doc={doc} filePath={fileName} darkMode={darkMode} />);
}
