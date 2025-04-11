// Name: KeyboardPlus
// ID: keyboardplus
// Description: Take keyboard input from the user as if they were typing in a text box and perform multiple checks by distinguishing what is typed in one text box from another with the ID.
// Original Extension by: silly software https://sillysoftware.lol/
// Modified by: XmerOriginals
// License: MPL-2.0

class KeyboardPlus {
    constructor() {
        this.inputs = {};
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    getInfo() {
        return {
            id: 'keyboardplus',
            name: 'Keyboard+',
			color1: '#585858',
            blocks: [
                {
                    opcode: 'startCapturingInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'start capturing input [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
                {
                    opcode: 'endCapturingInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'end capturing input [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
                {
                    opcode: 'captureInputUntilEnter',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'capture input until enter [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
                {
                    opcode: 'getTextInput',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'text input [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
                {
                    opcode: 'clearTextInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear text input [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
                {
                    opcode: 'setTextInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set text input [ID] to [TEXT]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' },
                        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'new text' }
                    }
                },
                {
                    opcode: 'isCapturingInput',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Capturing input [ID]?',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    },
                    disableMonitor: true
                },
                {
                    opcode: 'forceEndOtherCaptures',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'force end other captures except [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'default' }
                    }
                },
				{
                    opcode: 'endAllCapturing',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'end all capturing input',
				}
            ]
        };
    }

    startCapturingInput(args) {
        this.forceEndOtherCaptures(args);
        
        this.inputs[args.ID] = { isCapturing: true, textInput: '', captureCallback: null };
    }

    endCapturingInput(args) {
        if (this.inputs[args.ID]) {
            this.inputs[args.ID].isCapturing = false;
        }
    }

    forceEndOtherCaptures(args) {
        Object.keys(this.inputs).forEach((id) => {
            if (id !== args.ID && this.inputs[id].isCapturing) {
                this.inputs[id].isCapturing = false;
            }
        });
    }

    captureInputUntilEnter(args) {
        if (!this.inputs[args.ID]) {
            this.inputs[args.ID] = { isCapturing: true, textInput: '', captureCallback: null };
        }
        this.inputs[args.ID].isCapturing = true;
        this.inputs[args.ID].captureCallback = (key) => {
            if (key === 'Enter') {
                this.inputs[args.ID].isCapturing = false;
            }
        };
    }

    getTextInput(args) {
        return this.inputs[args.ID] ? this.inputs[args.ID].textInput : '';
    }

    clearTextInput(args) {
        if (this.inputs[args.ID]) {
            this.inputs[args.ID].textInput = '';
        }
    }

    setTextInput(args) {
        if (!this.inputs[args.ID]) {
            this.inputs[args.ID] = { isCapturing: false, textInput: args.TEXT, captureCallback: null };
        } else {
            this.inputs[args.ID].textInput = args.TEXT;
        }
    }

    isCapturingInput(args) {
        return this.inputs[args.ID] ? this.inputs[args.ID].isCapturing : false;
    }

    handleKeyDown(event) {
        Object.keys(this.inputs).forEach((id) => {
            const input = this.inputs[id];
            if (input.isCapturing) {
                const key = event.key;
                if (key === 'Backspace') {
                    if (event.ctrlKey) {
                        input.textInput = input.textInput.replace(/\s*\S+$/, '');
                    } else {
                        input.textInput = input.textInput.slice(0, -1);
                    }
                } else if (key === 'Enter') {
                    if (input.captureCallback) {
                        input.captureCallback('Enter');
                        input.captureCallback = null;
                    }
                } else if (key.length === 1) {
                    input.textInput += key;
                }
            }
        });
    }
	
	endAllCapturing() {
		Object.keys(this.inputs).forEach(id => {
			this.inputs[id].isCapturing = false;
		});
	}
}

Scratch.extensions.register(new KeyboardPlus());
