// Name: Sweet Alert
// Image: ./assets/extensions-images/sweetalert.png
// Author: XmerOriginals
// ID: sweetalertv2
// Description: It allows you to send modern customizable alerts using the Sweet Alert Library.
// Library: https://cdn.jsdelivr.net/npm/sweetalert2@11
// License: MPL-2.0
// v2

(function (Scratch) {
    "use strict";

    class SweetAlertv2 {
        constructor() {
            this.alertOpen = false;
            this.lastConfirmed = false;
        }

        getInfo() {
            return {
                id: "sweetalertv2",
                name: "Sweet Alert",
                color1: "#f351fc",
                blocks: [
                    {
                        opcode: "showAlert",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "show sweet alert with title [TITLE] and text [TEXT] of type [TYPE] ok text [BTEXT] cancel [CANCEL_ON] cancel text [CTEXT] box radius [BOX_RADIUS] button radius [BUTTON_RADIUS] colors box [BOX_COLOR] button [BUTTON_COLOR] cancel [CANCEL_COLOR]",
                        arguments: {
                            TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: "Title" },
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "This is a modern alert!" },
                            BTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "OK" },
                            CANCEL_ON: { type: Scratch.ArgumentType.STRING, menu: "cancelOptions", defaultValue: "off" },
                            CTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Cancel" },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: "alertTypes", defaultValue: "info" },
                            BOX_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "10px" },
                            BUTTON_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "5px" },
                            BOX_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffffff" },
                            BUTTON_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#3085d6" },
                            CANCEL_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#aaaaaa" }
                        },
                    },
                    {
                        opcode: "showAlertAwait",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "await sweet alert with title [TITLE] and text [TEXT] of type [TYPE] ok text [BTEXT] cancel [CANCEL_ON] cancel text [CTEXT] box radius [BOX_RADIUS] button radius [BUTTON_RADIUS] colors box [BOX_COLOR] button [BUTTON_COLOR] cancel [CANCEL_COLOR]",
                        arguments: {
                            TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: "Title" },
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "This is a modern alert!" },
                            BTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "OK" },
                            CANCEL_ON: { type: Scratch.ArgumentType.STRING, menu: "cancelOptions", defaultValue: "off" },
                            CTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Cancel" },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: "alertTypes", defaultValue: "info" },
                            BOX_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "10px" },
                            BUTTON_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "5px" },
                            BOX_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffffff" },
                            BUTTON_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#3085d6" },
                            CANCEL_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#aaaaaa" }
                        },
                    },
                    {
                        opcode: "showInputAlert",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "ask [QUESTION] with default [DEFAULT_TEXT] type [TYPE] empty warn [EMTEXT] cancel [CANCEL] ok text [BTEXT] cancel text [CTEXT] box radius [BOX_RADIUS] input radius [INPUT_RADIUS] button radius [BUTTON_RADIUS] colors box [BOX_COLOR] input [INPUT_COLOR] button [BUTTON_COLOR] cancel [CANCEL_COLOR]",
                        arguments: {
                            QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: "What is your name?" },
                            DEFAULT_TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Enter your name here..." },
                            EMTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "You need to enter something!" },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: "alertTypes", defaultValue: "question" },
                            CANCEL: { type: Scratch.ArgumentType.STRING, menu: "cancelOptions", defaultValue: "on" },
                            BTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "OK" },
                            CTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Cancel" },
                            BOX_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "10px" },
                            INPUT_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "5px" },
                            BUTTON_RADIUS: { type: Scratch.ArgumentType.STRING, defaultValue: "5px" },
                            BOX_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffffff" },
                            INPUT_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffffff" },
                            BUTTON_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#3085d6" },
                            CANCEL_COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#aaaaaa" }
                        },
                    },
                    {
                        blockType: "label",
                        text: "Controls",
                    },
                    {
                        opcode: "wasLastConfirmed",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "last alert was confirmed",
                    },
                    {
                        opcode: "isAlertOpen",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "an alert is open",
                    },
                    {
                        blockType: "label",
                        text: "Other",
                    },
                    {
                        opcode: "closeAlert",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "close the alert",
                    }
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
            const {
                TITLE, TEXT, TYPE, BTEXT, CANCEL_ON, CTEXT,
                BOX_RADIUS, BUTTON_RADIUS, BOX_COLOR, BUTTON_COLOR, CANCEL_COLOR
            } = args;

            this.alertOpen = true;

            window.Swal.fire({
                title: TITLE,
                text: TEXT,
                icon: TYPE,
                background: BOX_COLOR,
                showCancelButton: CANCEL_ON === "on",
                confirmButtonText: BTEXT,
                cancelButtonText: CTEXT,
                customClass: {
                    popup: 'swal2-custom-box',
                    confirmButton: 'swal2-custom-button',
                    cancelButton: 'swal2-custom-cancel'
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-popup.swal2-custom-box');
                    const confirm = document.querySelector('.swal2-confirm.swal2-custom-button');
                    const cancel = document.querySelector('.swal2-cancel.swal2-custom-cancel');
                    if (popup) popup.style.borderRadius = BOX_RADIUS;
                    if (confirm) {
                        confirm.style.borderRadius = BUTTON_RADIUS;
                        confirm.style.backgroundColor = BUTTON_COLOR;
                    }
                    if (cancel) {
                        cancel.style.borderRadius = BUTTON_RADIUS;
                        cancel.style.backgroundColor = CANCEL_COLOR;
                    }
                },
                willClose: () => {
                    this.alertOpen = false;
                }
            }).then((result) => {
                this.lastConfirmed = result.isConfirmed;
            });
        }

        async showAlertAwait(args) {
            const {
                TITLE, TEXT, TYPE, BTEXT, CANCEL_ON, CTEXT,
                BOX_RADIUS, BUTTON_RADIUS, BOX_COLOR, BUTTON_COLOR, CANCEL_COLOR
            } = args;

            this.alertOpen = true;

            const result = await Swal.fire({
                title: TITLE,
                text: TEXT,
                icon: TYPE,
                background: BOX_COLOR,
                showCancelButton: CANCEL_ON === "on",
                confirmButtonText: BTEXT,
                cancelButtonText: CTEXT,
                customClass: {
                    popup: 'swal2-custom-box',
                    confirmButton: 'swal2-custom-button',
                    cancelButton: 'swal2-custom-cancel'
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-popup.swal2-custom-box');
                    const confirm = document.querySelector('.swal2-confirm.swal2-custom-button');
                    const cancel = document.querySelector('.swal2-cancel.swal2-custom-cancel');
                    if (popup) popup.style.borderRadius = BOX_RADIUS;
                    if (confirm) {
                        confirm.style.borderRadius = BUTTON_RADIUS;
                        confirm.style.backgroundColor = BUTTON_COLOR;
                    }
                    if (cancel) {
                        cancel.style.borderRadius = BUTTON_RADIUS;
                        cancel.style.backgroundColor = CANCEL_COLOR;
                    }
                },
                willClose: () => {
                    this.alertOpen = false;
                }
            });

            this.lastConfirmed = result.isConfirmed;
        }


        showInputAlert(args) {
            const {
                QUESTION, DEFAULT_TEXT, EMTEXT, TYPE, CANCEL, BTEXT, CTEXT,
                BOX_RADIUS, INPUT_RADIUS, BUTTON_RADIUS,
                BOX_COLOR, INPUT_COLOR, BUTTON_COLOR, CANCEL_COLOR
            } = args;

            this.alertOpen = true;

            return new Promise((resolve) => {
                window.Swal.fire({
                    title: QUESTION,
                    input: "text",
                    inputPlaceholder: DEFAULT_TEXT,
                    icon: TYPE,
                    showCancelButton: CANCEL === "on",
                    allowEscapeKey: CANCEL === "on",
                    confirmButtonText: BTEXT,
                    cancelButtonText: CTEXT,
                    background: BOX_COLOR,
                    customClass: {
                        popup: 'swal2-custom-box',
                        input: 'swal2-custom-input',
                        confirmButton: 'swal2-custom-button',
                        cancelButton: 'swal2-custom-cancel'
                    },
                    inputValidator: (value) => {
                        if (!value) return EMTEXT;
                    },
                    didOpen: () => {
                        const popup = document.querySelector('.swal2-popup.swal2-custom-box');
                        const input = document.querySelector('.swal2-input.swal2-custom-input');
                        const confirm = document.querySelector('.swal2-confirm.swal2-custom-button');
                        const cancel = document.querySelector('.swal2-cancel.swal2-custom-cancel');
                        if (popup) popup.style.borderRadius = BOX_RADIUS;
                        if (input) {
                            input.style.borderRadius = INPUT_RADIUS;
                            input.style.backgroundColor = INPUT_COLOR;
                        }
                        if (confirm) {
                            confirm.style.borderRadius = BUTTON_RADIUS;
                            confirm.style.backgroundColor = BUTTON_COLOR;
                        }
                        if (cancel) {
                            cancel.style.borderRadius = BUTTON_RADIUS;
                            cancel.style.backgroundColor = CANCEL_COLOR;
                        }
                    },
                    willClose: () => {
                        this.alertOpen = false;
                    }
                }).then((result) => {
                    this.lastConfirmed = result.isConfirmed;
                    resolve(result.isConfirmed ? result.value : "");
                });
            });
        }

        closeAlert() {
            this.alertOpen = false;
            window.Swal.close();
        }

        isAlertOpen() {
            return this.alertOpen;
        }

        wasLastConfirmed() {
            return this.lastConfirmed;
        }
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.onload = () => {
        Scratch.extensions.register(new SweetAlertv2());
    };
    document.head.appendChild(script);
})(Scratch);
