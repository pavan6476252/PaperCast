import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const ContentLockExtension = Extension.create({
  name: "contentLock",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("contentLock"),
        filterTransaction(transaction, state) {
          // If the transaction changes the document (e.g., typing, deleting)
          if (transaction.docChanged) {
            // Compare the pure text content of the old and new document
            // If the text string itself is modified, reject the transaction.
            // This still allows transactions that only add/remove marks (like Bold).
            if (transaction.doc.textContent !== state.doc.textContent) {
              return false;
            }
          }
          return true;
        },
      }),
    ];
  },
});
