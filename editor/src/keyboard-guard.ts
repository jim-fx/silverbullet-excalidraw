/**
 * Work around SilverBullet's document-editor keyboard bridge.
 *
 * The full-screen document editor renders inside a same-origin iframe. To keep
 * global shortcuts (command palette, etc.) working while the iframe is focused,
 * SilverBullet injects a capture-phase `keydown` listener on the iframe window
 * that re-dispatches every keystroke to the parent document. If the parent's
 * keymap handles the key and calls `preventDefault()`, the bridge then cancels
 * the *real* event inside the iframe.
 *
 * For plain (unmodified) editing keys — Backspace, Delete, arrows, Enter, … —
 * the host page's CodeMirror keymap reports them as handled, so Excalidraw never
 * receives them: pressing Backspace mid-word, or Delete on a selected shape,
 * tears the user out of edit mode instead of editing the drawing.
 *
 * Since the iframe is same-origin we can intercept the forwarded synthetic event
 * on the *parent* window in the capture phase — before SilverBullet's own
 * (bubble-phase) window listener runs — and stop it. SilverBullet then never
 * marks the synthetic event as `defaultPrevented`, so its bridge leaves the real
 * key alone and Excalidraw handles it normally.
 *
 * We only swallow keys without Ctrl/Cmd so genuine global command shortcuts
 * still reach SilverBullet, and only while *this* editor's iframe is the focused
 * element, so we never interfere with the regular page editor.
 */

const INSTALLED_FLAG = "__excalidrawKeyboardGuardInstalled";

export function installKeyboardGuard(): void {
  const parentWin = globalThis.parent;

  // Not embedded in an iframe (e.g. standalone) — nothing to guard against.
  if (!parentWin || parentWin === globalThis) {
    return;
  }

  let parentDoc: Document;
  try {
    parentDoc = parentWin.document;
  } catch {
    // Cross-origin parent (shouldn't happen for SilverBullet's srcdoc iframe).
    return;
  }

  // Avoid installing twice if the editor is (re)mounted.
  if ((globalThis as any)[INSTALLED_FLAG]) {
    return;
  }
  (globalThis as any)[INSTALLED_FLAG] = true;

  const isOurIframeFocused = (): boolean => {
    const active = parentDoc.activeElement as HTMLIFrameElement | null;
    return !!active && active.tagName === "IFRAME" &&
      active.contentWindow === globalThis;
  };

  const handler = (event: KeyboardEvent) => {
    // Let real command shortcuts (Cmd/Ctrl-…) keep reaching SilverBullet.
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    if (!isOurIframeFocused()) {
      return;
    }
    // Prevent SilverBullet's host keydown handler from running its CodeMirror
    // keymap (which would `preventDefault` the forwarded event and thereby
    // cancel the real key inside this iframe). Excalidraw then receives it.
    event.stopImmediatePropagation();
  };

  parentWin.addEventListener("keydown", handler, true);

  // Clean up when this editor iframe is torn down.
  globalThis.addEventListener("pagehide", () => {
    parentWin.removeEventListener("keydown", handler, true);
    (globalThis as any)[INSTALLED_FLAG] = false;
  }, { once: true });
}
