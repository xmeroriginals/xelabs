// Name: Birthday
// Image: ./assets/extensions-images/birthday.png
// ID: birthday
// Description: It allows you to quickly and easily calculate birthdays and start birthday celebration festivities in an optimized way. It also returns the next birthday if it is not due.
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  class Birthday {
    constructor() {
      this.birthday = "";
      this.setBirthday({ DATE: "11.7.2000" });
      this.confettiParticles = [];
      this.canvas = document.createElement("canvas");
      this.canvas.style.position = "absolute";
      this.canvas.style.top = "0";
      this.canvas.style.left = "0";
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.zIndex = "9999";
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.updateCanvasSize();
      this.draw();
      this.confettiTimeouts = [];
    }

    updateCanvasSize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    setBirthday(args) {
      const dateParts = args.DATE.split(".");
      if (dateParts.length !== 3) {
        this.birthday = "invalid date format";
        return;
      }
      const [day, month, year] = dateParts.map((part) => parseInt(part, 10));
      const currentYear = new Date().getFullYear();
      if (year > currentYear || year < 1800) {
        this.birthday = "invalid year";
        return;
      }
      const date = new Date(year, month - 1, day);
      this.birthday = isNaN(date) ? "invalid date" : date;
    }

    getNextBirthday() {
      if (typeof this.birthday === "string") {
        return this.birthday;
      }
      if (!this.birthday || isNaN(this.birthday)) {
        return "invalid date";
      }

      const today = new Date();
      const currentYear = today.getFullYear();
      let nextBirthday = new Date(
        currentYear,
        this.birthday.getMonth(),
        this.birthday.getDate()
      );

      if (
        today.getMonth() === nextBirthday.getMonth() &&
        today.getDate() === nextBirthday.getDate()
      ) {
        return "happy birthday";
      }

      if (today > nextBirthday) {
        nextBirthday.setFullYear(currentYear + 1);
      }

      const diffTime = nextBirthday - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return `next birthday in ${diffDays} days`;
    }

    isBirthdayToday() {
      if (typeof this.birthday === "string") {
        return false;
      }
      const today = new Date();
      return (
        today.getDate() === this.birthday.getDate() &&
        today.getMonth() === this.birthday.getMonth()
      );
    }

    createConfetti(args) {
      const now = Date.now();
      const amount = args.AMOUNT * 3;
      for (let i = 0; i < amount; i++) {
        const timeoutId = setTimeout(() => {
          if (document.hidden) return;

          this.confettiParticles.push({
            x: Math.random() * this.canvas.width,
            y: 0,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 2 + 1,
            angle: Math.random() * 2 * Math.PI,
            rotationSpeed: Math.random() * 0.1 - 0.05,
            color: "hsl(" + Math.random() * 360 + ", 100%, 50%)",
            startTime: now,
          });
        }, i * 10);
        this.confettiTimeouts.push(timeoutId);
      }
    }

    clearConfetti() {
      this.confettiParticles = [];
      this.confettiTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      this.confettiTimeouts = [];
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.confettiParticles.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.angle) * p.speed;
        p.angle += p.rotationSpeed;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        this.ctx.beginPath();
        this.ctx.moveTo(-p.size, 0);
        this.ctx.lineTo(0, -p.size);
        this.ctx.lineTo(p.size, 0);
        this.ctx.lineTo(0, p.size);
        this.ctx.closePath();
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        this.ctx.restore();
      });
      this.confettiParticles = this.confettiParticles.filter(
        (p) => p.y < this.canvas.height && p.x > 0 && p.x < this.canvas.width
      );
      requestAnimationFrame(() => this.draw());
    }

    getInfo() {
      return {
        id: "birthday",
        name: "Birthday",
        color1: "#dd5bb1",
        blocks: [
          {
            opcode: "setBirthday",
            blockType: Scratch.BlockType.COMMAND,
            text: "set birthday to [DATE]",
            arguments: {
              DATE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "11.7.2000",
              },
            },
          },
          {
            opcode: "getNextBirthday",
            blockType: Scratch.BlockType.REPORTER,
            text: "next birthday",
          },
          {
            opcode: "isBirthdayToday",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is today birthday?",
          },
          {
            blockType: "label",
            text: "Celebration",
          },
          {
            opcode: "createConfetti",
            blockType: Scratch.BlockType.COMMAND,
            text: "create [AMOUNT] confetti",
            arguments: {
              AMOUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
              },
            },
          },
          {
            opcode: "clearConfetti",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear all confetti",
          },
        ],
      };
    }
  }

  Scratch.extensions.register(new Birthday());
})(Scratch);
