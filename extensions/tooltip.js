// Name: Tooltip
// Image: ./assets/extensions-images/tooltip.png
// New: true
// Author: XmerOriginals
// ID: tooltip
// Description: It allows you to call customizable Tooltips that will simply follow the cursor in your project.
// License: MPL-2.0

(function (Scratch) {
    'use strict';
    const id = 'tooltip';
    const cssid = `${id}-style`;

    class Tooltip {
        constructor() {
            this.tooltipElement = null;
            this.currentText = '';
            this.lastRequestedPosition = 'bottom-right';
            this.fadeDuration = 0.3;
            this.moveDuration = 0.3;
            this.isMouseInsideWindow = true;
            this.lastShowCallTime = 0;
            this.defaultStyle = {
                backgroundColor: '#333333',
                color: '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#cccccc',
                borderRadius: '4px',
                padding: '8px 12px',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontSize: '12px',
                fontWeight: 'normal',
                fontStyle: 'normal',
                minWidth: 'auto',
                maxWidth: '300px',
                boxSizing: 'border-box',
                opacity: '0',
                display: 'none',
                position: 'absolute',
                zIndex: 1000,
                pointerEvents: 'none'
            };

            this.currentStyle = { ...this.defaultStyle };

            this.mouseX = 0;
            this.mouseY = 0;

            this.injectCSS();
            this.setupEventListeners();
            this._updateTransitionStyle();
        }

        setupEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.isMouseInsideWindow = true;
                if (this.tooltipElement) {
                    this.updateTooltipPosition();
                }
            });

            window.addEventListener('scroll', () => {
                if (this.tooltipElement) {
                    this.updateTooltipPosition();
                }
            });
            window.addEventListener('resize', () => {
                if (this.tooltipElement) {
                    this.updateTooltipPosition();
                }
            });
        }

        injectCSS() {
            if (document.getElementById(cssid)) {
                return;
            }

            const style = document.createElement('style');
            style.id = cssid;
            style.innerHTML = `
          .advanced-tooltip {
            box-sizing: border-box; 
            transition: opacity var(--fade-duration, 0.3s) ease-in-out,
                        left var(--move-duration, 0.3s) ease-out,
                        top var(--move-duration, 0.3s) ease-out;
          }
        `;
            document.head.appendChild(style);
        }

        getInfo() {
            return {
                id: id,
                name: 'Tooltip',
                color1: '#5b5ffc',
                blocks: [
                    {
                        opcode: 'showTooltipText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show tooltip [TEXT] at [POSITION]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello World!'
                            },
                            POSITION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'bottom-right',
                                menu: 'positionMenu'
                            }
                        }
                    },
                    {
                        opcode: 'hideTooltip',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide tooltip'
                    },
                    {
                        blockType: "label",
                        text: "Visual",
                    },
                    {
                        opcode: 'setStyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set tooltip style: background [BGCOLOR] text [TEXTCOLOR] border color [BORDERCOLOR] border size [BORDERSIZE] border style [BORDERSTYLE] border radius [BORDERADIUS] padding [PADDING] align [ALIGN] font [FONT] bold [BOLD] italic [ITALIC] min width [MINWIDTH] max width [MAXWIDTH]',
                        arguments: {
                            BGCOLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: this.defaultStyle.backgroundColor
                            },
                            TEXTCOLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: this.defaultStyle.color
                            },
                            BORDERCOLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: this.defaultStyle.borderColor
                            },
                            BORDERSIZE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.borderWidth
                            },
                            BORDERSTYLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.borderStyle,
                                menu: 'borderStyleMenu'
                            },
                            BORDERADIUS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.borderRadius
                            },
                            PADDING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.padding
                            },
                            ALIGN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.textAlign,
                                menu: 'alignMenu'
                            },
                            FONT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.fontFamily
                            },
                            BOLD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'false',
                                menu: 'booleanMenu'
                            },
                            ITALIC: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'false',
                                menu: 'booleanMenu'
                            },
                            MINWIDTH: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.minWidth
                            },
                            MAXWIDTH: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: this.defaultStyle.maxWidth
                            }
                        }
                    },
                    {
                        opcode: 'setAnimationDuration',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [TYPE] animation duration to [DURATION] seconds',
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'fade',
                                menu: 'animationTypeMenu'
                            },
                            DURATION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            }
                        }
                    }
                ],
                menus: {
                    positionMenu: {
                        acceptReporters: true,
                        items: [
                            'top-left', 'top-center', 'top-right',
                            'left', 'right',
                            'bottom-left', 'bottom-center', 'bottom-right'
                        ]
                    },
                    alignMenu: {
                        acceptReporters: true,
                        items: ['left', 'center', 'right']
                    },
                    booleanMenu: {
                        acceptReporters: true,
                        items: ['true', 'false']
                    },
                    borderStyleMenu: {
                        acceptReporters: true,
                        items: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']
                    },
                    animationTypeMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'fade in/out', value: 'fade' },
                            { text: 'move Speed', value: 'move' },
                        ]
                    }
                }
            };
        }

        createTooltip() {
            if (!this.tooltipElement) {
                this.tooltipElement = document.createElement('div');
                this.tooltipElement.classList.add('advanced-tooltip');
                document.body.appendChild(this.tooltipElement);

                Object.assign(this.tooltipElement.style, this.defaultStyle, this.currentStyle);
                this._updateTransitionStyle();
            }
        }

        _updateTransitionStyle() {
            if (this.tooltipElement) {
                this.tooltipElement.style.setProperty('--fade-duration', `${this.fadeDuration}s`);
                this.tooltipElement.style.setProperty('--move-duration', `${this.moveDuration}s`);
            }
        }

        updateTooltipPosition() {
            if (!this.tooltipElement) return;

            const tooltipWidth = this.tooltipElement.offsetWidth;
            const tooltipHeight = this.tooltipElement.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const offset = 15;

            let desiredLeft, desiredTop;

            switch (this.lastRequestedPosition) {
                case 'top-left':
                    desiredLeft = this.mouseX - tooltipWidth - offset;
                    desiredTop = this.mouseY - tooltipHeight - offset;
                    break;
                case 'top-center':
                    desiredLeft = this.mouseX - (tooltipWidth / 2);
                    desiredTop = this.mouseY - tooltipHeight - offset;
                    break;
                case 'top-right':
                    desiredLeft = this.mouseX + offset;
                    desiredTop = this.mouseY - tooltipHeight - offset;
                    break;
                case 'left':
                    desiredLeft = this.mouseX - tooltipWidth - offset;
                    desiredTop = this.mouseY - (tooltipHeight / 2);
                    break;
                case 'right':
                    desiredLeft = this.mouseX + offset;
                    desiredTop = this.mouseY - (tooltipHeight / 2);
                    break;
                case 'bottom-left':
                    desiredLeft = this.mouseX - tooltipWidth - offset;
                    desiredTop = this.mouseY + offset;
                    break;
                case 'bottom-center':
                    desiredLeft = this.mouseX - (tooltipWidth / 2);
                    desiredTop = this.mouseY + offset;
                    break;
                case 'bottom-right':
                default:
                    desiredLeft = this.mouseX + offset;
                    desiredTop = this.mouseY + offset;
                    break;
            }

            let finalLeft = desiredLeft;
            let finalTop = desiredTop;

            if (tooltipWidth > 0 && tooltipHeight > 0) {
                finalLeft = Math.max(0, finalLeft);
                finalLeft = Math.min(finalLeft, viewportWidth - tooltipWidth);
                finalTop = Math.max(0, finalTop);
                finalTop = Math.min(finalTop, viewportHeight - tooltipHeight);
            }

            this.tooltipElement.style.left = `${finalLeft}px`;
            this.tooltipElement.style.top = `${finalTop}px`;
        }

        showTooltipText(args) {
            this.lastShowCallTime = Date.now();
            this.createTooltip();

            if (this.tooltipElement.style.display !== 'none' && this.currentText === args.TEXT && this.lastRequestedPosition === args.POSITION) {
                this.updateTooltipPosition();
                return;
            }

            this.tooltipElement.textContent = args.TEXT;
            this.currentText = args.TEXT;
            this.lastRequestedPosition = args.POSITION;

            Object.assign(this.tooltipElement.style, this.currentStyle);

            this.tooltipElement.style.opacity = '0';
            this.tooltipElement.style.display = 'block';

            requestAnimationFrame(() => {
                this.tooltipElement.style.opacity = '1';
                this.updateTooltipPosition();
            });
        }

        hideTooltip() {
            if (!this.tooltipElement || this.tooltipElement.style.display === 'none') {
                this.currentText = '';
                return;
            }

            const hideOnTransitionEnd = (event) => {
                if (event.propertyName === 'opacity') {
                    const currentOpacity = parseFloat(this.tooltipElement.style.opacity);
                    if (currentOpacity < 0.05) {
                        this.tooltipElement.style.display = 'none';
                        this.tooltipElement.removeEventListener('transitionend', hideOnTransitionEnd);
                        this.currentText = '';
                    }
                }
            };

            if (this.fadeDuration > 0) {
                this.tooltipElement.removeEventListener('transitionend', hideOnTransitionEnd);
                this.tooltipElement.addEventListener('transitionend', hideOnTransitionEnd);
                this.tooltipElement.style.opacity = '0';
            } else {
                this.tooltipElement.style.display = 'none';
                this.currentText = '';
                this.tooltipElement.removeEventListener('transitionend', hideOnTransitionEnd);
            }
        }

        setStyle(args) {
            this.createTooltip();

            const fontWeight = args.BOLD === 'true' ? 'bold' : 'normal';
            const fontStyle = args.ITALIC === 'true' ? 'italic' : 'normal';

            this.currentStyle = {
                ...this.currentStyle,
                backgroundColor: args.BGCOLOR,
                color: args.TEXTCOLOR,
                borderWidth: args.BORDERSIZE,
                borderStyle: args.BORDERSTYLE,
                borderColor: args.BORDERCOLOR,
                borderRadius: args.BORDERADIUS,
                padding: args.PADDING,
                textAlign: args.ALIGN,
                fontFamily: args.FONT,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
                minWidth: args.MINWIDTH,
                maxWidth: args.MAXWIDTH,
            };

            Object.assign(this.tooltipElement.style, this.currentStyle);

            if (this.tooltipElement.style.display !== 'none') {
                requestAnimationFrame(() => {
                    this.updateTooltipPosition();
                });
            } else {
                requestAnimationFrame(() => {
                    this.updateTooltipPosition();
                });
            }
        }

        setAnimationDuration(args) {
            const type = args.TYPE;
            const duration = parseFloat(args.DURATION);

            if (isNaN(duration) || duration < 0) {
                console.warn(`Advanced Tooltips: Invalid duration "${args.DURATION}". Duration must be a non-negative number.`);
                return;
            }

            if (type === 'fade') {
                this.fadeDuration = duration;
            } else if (type === 'move') {
                this.moveDuration = duration;
            }

            this._updateTransitionStyle();
        }
    }

    Scratch.extensions.register(new Tooltip());
})(Scratch);
