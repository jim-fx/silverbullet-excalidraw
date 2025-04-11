import { asset } from "@silverbulletmd/silverbullet/syscalls";

const env = "development";

export async function viewer(): Promise<{ html: string; script: string }> {
  const reactDom = await asset.readAsset("excalidraw", `assets/react-dom.${env}.js`);
  const react = await asset.readAsset("excalidraw", `assets/react.${env}.js`);
  const main = await asset.readAsset("excalidraw", "assets/main.js");
  return {
    html: `<link rel="stylesheet" href="https://unpkg.com/excalidraw@0.6.4/dist/excalidraw.min.css">
<script src="https://unpkg.com/@excalidraw/excalidraw@0.18.0/dist/prod/index.js"></script>
<div id="app"></div>`,
    script: `${react}
    ${reactDom}
    ${main}`
  }
}

export function widget(
  bodyText: string,
): { html: string; script: string } {
  console.log({ bodyText })
  return {
    html: `
      <style>
        .excalidraw .App-menu_bottom section {
          display: none;
        }
        .disable-zen-mode {
          display: none !important;
       }
      </style>
      <code style="display: none;">${bodyText}</code>
      <div id="app" style="min-height: 500px; overflow: hidden; border-radius: 5px;"/>
    `,
    script: `
      function onChange(elements, state) {
        sessionStorage.setItem("excalidraw-state", JSON.stringify(state));
        sessionStorage.setItem("excalidraw-elements", JSON.stringify(elements));
        console.log({elements})
      }

      const elements = JSON.parse(document.getElementsByTagName("code")[0]?.innerText||sessionStorage.getItem("excalidraw-elements")||'[]');

      const App = () => {
        const appState = JSON.parse(sessionStorage.getItem("excalidraw-state")||"{}");
        delete appState.collaborators;
        const theme = appState?.theme || "light";

        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div", {
              style: { height: "500px" },
            },
            React.createElement(ExcalidrawLib.Excalidraw, {
              onChange, 
              initialData: { appState, elements }, 
              UIOptions: { canvasActions: { toggleTheme: true }},
              theme
            }),
          ),
        );
      };

    `,
  };
}
