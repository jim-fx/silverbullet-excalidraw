
# Excalidraw Plugin for Silverbullet 

This plugin adds Excalidraw support to Silverbullet, allowing you to create and edit diagrams directly in your notes.

## Installation
Run the `{[Plugs: Add]}` command and paste in: `github:jim-fx/silverbullet-excalidraw/excalidraw.plug.js`

*That's all!*

## Usage

Run the `{[Excalidraw: Create Diagram]}` command and enter a name for the excalidraw file like `Diagram`


## Settings

You can customize the behavior of the plugin by adding the following settings to your `Space Config` file:

```space-config
excalidraw:
  createInSubfolder: true
```

## Build
To build the editor components you need to have [pnpm](https://pnpm.io/) installed. Then run
```shell
cd editor
pnpm install
```

To build the plugin run this from the root of the project:
```shell
deno task build
```


