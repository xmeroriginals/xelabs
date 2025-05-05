// Name: Sweet Alert
// Image: ./assets/extensions-images/sweetalert.svg
// ID: sweetalert
// Description: It allows you to send modern alerts using the Sweet Alert library ** Library line 135 https://cdn.jsdelivr.net/npm/sweetalert2@11 **
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  class SweetAlert {
    getInfo() {
      return {
        id: "sweetalert",
        name: "Sweet Alert",
        color1: "#f351fc",
        blocks: [
          {
            opcode: "showAlert",
            blockType: Scratch.BlockType.COMMAND,
            text: "show sweet alert with title [TITLE] and text [TEXT] of type [TYPE] button text [BTEXT]",
            arguments: {
              TITLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Title",
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "This is a modern alert!",
              },
              BTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "OK",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "alertTypes",
                defaultValue: "success",
              },
            },
          },
          {
            opcode: "showInputAlert",
            blockType: Scratch.BlockType.REPORTER,
            text: "ask [QUESTION] with default [DEFAULT_TEXT] of type [TYPE] empty text warn [EMTEXT] cancel [CANCEL]",
            arguments: {
              QUESTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "What is your name?",
              },
              DEFAULT_TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Enter your name here...",
              },
              EMTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "You need to enter something!",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "alertTypes",
                defaultValue: "question",
              },
              CANCEL: {
                type: Scratch.ArgumentType.STRING,
                menu: "cancelOptions",
                defaultValue: "on",
              },
            },
          },
          {
            opcode: "closeAlert",
            blockType: Scratch.BlockType.COMMAND,
            text: "close the alert",
          },
        ],
        menus: {
          alertTypes: {
            acceptReporters: true,
            items: ["success", "error", "warning", "info", "question"],
          },
          cancelOptions: {
            acceptReporters: true,
            items: ["on", "off"],
          },
        },
      };
    }

    showAlert(args) {
      const { TITLE, TEXT, BTEXT, TYPE } = args;

      window.Swal.fire({
        title: TITLE,
        text: TEXT,
        icon: TYPE,
        confirmButtonText: BTEXT,
      });
    }

    showInputAlert(args) {
      const { QUESTION, DEFAULT_TEXT, EMTEXT, TYPE, CANCEL } = args;

      return new Promise((resolve) => {
        window.Swal.fire({
          title: QUESTION,
          input: "text",
          inputPlaceholder: DEFAULT_TEXT,
          icon: TYPE,
          showCancelButton: CANCEL === "on",
          inputValidator: (value) => {
            if (!value) {
              return EMTEXT;
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const inputValue = result.value;
            if (inputValue) {
              resolve("₺" + inputValue);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    }

    closeAlert() {
      window.Swal.close();
    }
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  script.onload = () => {
    Scratch.extensions.register(new SweetAlert());
  };
  document.head.appendChild(script);
})(Scratch);
