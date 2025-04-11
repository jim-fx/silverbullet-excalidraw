let appState;
let elements;

function onChange(elements, state) {
  console.log("onChange",{elements,state})
}

const App = ({ doc }) => {
  const theme = doc.appState?.theme || "light";
  console.log({Excalidraw, ExcalidrawLib})

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div", {
        style: { height: "500px" },
      },
      React.createElement(ExcalidrawLib.default, {
        onChange, 
        initialData: doc, 
        UIOptions: { canvasActions: { toggleTheme: true }},
        theme
      }),
    ),
  );
};

async function open(data, extension){
  const excalidrawContent = new TextDecoder().decode(data);
  const doc = JSON.parse(excalidrawContent);

  const excalidrawWrapper = document.getElementById("app");
  const root = ReactDOM.createRoot(excalidrawWrapper);
  root.render(React.createElement(App, {doc}));
}

globalThis.silverbullet.addEventListener("file-open", (event) => open(event.detail.data, event.detail.meta.extension));
// globalThis.silverbullet.addEventListener("file-update", (event) => console.log("update", event.detail.data, event.detail.meta.extension));
