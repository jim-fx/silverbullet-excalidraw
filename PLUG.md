---
name: Library/jim-fx/excalidraw/PLUG
tags: meta/library
files:
- excalidraw.plug.js
---
This library adds [Excalidraw](https://excalidraw.com/) support to SilverBullet,
letting you create and edit diagrams directly in your notes.

After installing, run the `Excalidraw: Create diagram` command (or the
`/excalidraw` slash command) to create a new `.excalidraw` file and embed it.

## Settings
You can customize the behavior of the plugin by adding the following to your
`Space Config`:

```space-config
excalidraw:
  createInSubfolder: true
```
