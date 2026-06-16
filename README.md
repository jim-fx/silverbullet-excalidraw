
# Excalidraw Plugin for Silverbullet 

This plugin adds Excalidraw support to Silverbullet, allowing you to create and edit diagrams directly in your notes.

## Installation
This plug is distributed as a [Library](https://silverbullet.md/Library). Run the
`{[Library: Install]}` command and paste in the library URI:

```
https://github.com/jim-fx/silverbullet-excalidraw/blob/main/PLUG.md
```

*That's all!*

## Usage

Run the `{[Excalidraw: Create diagram]}` command (or the `/excalidraw` slash command) and enter a name for the excalidraw file like `Diagram`.


## Settings

You can customize the behavior of the plugin by adding the following settings to your `Space Config` file:

```space-config
excalidraw:
  createInSubfolder: true
```

## Build
The plug has two parts: the editor frontend (React + Excalidraw, built with
[pnpm](https://pnpm.io/)) and the plug itself (built with the
`plug-compile` CLI shipped by [`@silverbulletmd/silverbullet`](https://www.npmjs.com/package/@silverbulletmd/silverbullet)).

Install the dependencies once:
```shell
npm install
cd editor && pnpm install && cd ..
```

Then build everything (editor bundle + `excalidraw.plug.js`) from the project root:
```shell
npm run build
```

You can also rebuild the parts individually with `npm run build:editor` and
`npm run build:plug`, or watch the plug with `npm run watch`.

To develop, copy the resulting `excalidraw.plug.js` into your space and run the
`{[Plugs: Reload]}` command.
