export function widget(
  bodyText: string,
): { html: string; script: string } {
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
      <div id="app" style="min-height: 500px; overflow: hidden; border-radius: 5px;"/>
    `,
    script: `
      function onChange(elements, state) {
        sessionStorage.setItem("excalidraw-state", JSON.stringify(state));
        sessionStorage.setItem("excalidraw-elements", JSON.stringify(elements));
      }

      const App = () => {
        const appState = JSON.parse(sessionStorage.getItem("excalidraw-state")||"{}");
        delete appState.collaborators;
        const theme = appState?.theme || "light";
  
        const elements = JSON.parse(sessionStorage.getItem("excalidraw-elements")||"[]");

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

      Promise.all([
        loadJsByUrl("https://unpkg.com/@excalidraw/excalidraw/dist/excalidraw.development.js"),
        loadJsByUrl("https://unpkg.com/react@18.2.0/umd/react.development.js"),
        loadJsByUrl("https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js")
      ]).then(() => {
        const excalidrawWrapper = document.getElementById("app");
        const root = ReactDOM.createRoot(excalidrawWrapper);
        root.render(React.createElement(App));
        updateHeight();
        setTimeout(() => {
          updateHeight();
        }, 1000);
      });
    `,
  };
}
