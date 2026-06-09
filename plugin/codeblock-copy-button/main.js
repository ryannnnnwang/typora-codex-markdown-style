const core = window[Symbol.for("typora-plugin-core@v2")];
const { HtmlPostProcessor, Plugin } = core;

function getCode(codeblock) {
  const cid = codeblock.getAttribute("cid");
  const domCodeMirror = codeblock.querySelector(".CodeMirror")?.CodeMirror;
  const codeMirror = domCodeMirror || (cid && window.editor.fences.getCm(cid));

  if (codeMirror?.getValue) {
    return codeMirror.getValue();
  }

  if (cid && window.editor.fences.getValue) {
    return window.editor.fences.getValue(cid);
  }

  return (
    codeblock.querySelector(".CodeMirror-code")?.innerText ||
    codeblock.cloneNode(true).innerText ||
    ""
  );
}

function showCopied(button) {
  button.classList.add("codex-copy-success");
  button.title = "已复制";

  window.setTimeout(() => {
    button.classList.remove("codex-copy-success");
    button.title = "复制";
  }, 1200);
}

function addCopyButton(codeblock) {
  let buttons = codeblock.querySelector(".typ-buttons");

  if (!buttons) {
    buttons = document.createElement("div");
    buttons.className = "typ-buttons";
    buttons.addEventListener("mouseup", (event) => event.stopPropagation());
    codeblock.append(buttons);
  }

  if (buttons.querySelector(".codex-codeblock-copy")) {
    return;
  }

  const button = document.createElement("button");
  button.className = "typ-block-operate-button codex-codeblock-copy";
  button.type = "button";
  button.title = "复制";
  button.setAttribute("aria-label", "复制代码");
  button.innerHTML = '<span class="fa fa-clipboard"></span>';

  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const code = getCode(codeblock);
    window.editor.UserOp.nativeCopyText(code);
    showCopied(button);
  });

  buttons.append(button);
}

function scanCodeblocks(root = document) {
  if (root.matches?.(".md-fences")) {
    addCopyButton(root);
  }

  root.querySelectorAll?.(".md-fences").forEach(addCopyButton);
}

export default class CodeblockCopyButtonPlugin extends Plugin {
  onload() {
    this.registerMarkdownPostProcessor(
      HtmlPostProcessor.from({
        selector: ".md-fences",
        process: addCopyButton,
      })
    );

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const codeblock = mutation.target.closest?.(".md-fences");
        if (codeblock) {
          addCopyButton(codeblock);
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            scanCodeblocks(node);
          }
        });
      });
    });

    observer.observe(window.editor.writingArea, {
      childList: true,
      subtree: true,
    });

    this.register(() => observer.disconnect());
    scanCodeblocks(window.editor.writingArea);
    window.setTimeout(() => scanCodeblocks(window.editor.writingArea), 300);
  }
}
