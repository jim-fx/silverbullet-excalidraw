import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/dist/types/excalidraw/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/dist/types/excalidraw/types";

export type SaveState = {
  elements: readonly OrderedExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}
