// Name: Translate
// Image: ./assets/extensions-images/translate.png
// Author: XmerOriginals
// ID: translate
// Description: It allows you to translate easily and quickly with translation APIs.
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  class Translate {
    getInfo() {
      return {
        id: 'translate',
        name: 'Translate',
        color1: '#5b5ffc',
        blocks: [
          {
            opcode: 'translateWithLingva',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Lingva translate text [TEXT] from [FROM] to [TO]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world!' },
              FROM: { type: Scratch.ArgumentType.STRING, defaultValue: 'auto' },
              TO: { type: Scratch.ArgumentType.STRING, defaultValue: 'pt-PT' }
            }
          },
          {
            opcode: 'translateWithGoogle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Google translate text [TEXT] from [FROM] to [TO]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world!' },
              FROM: { type: Scratch.ArgumentType.STRING, defaultValue: 'auto' },
              TO: { type: Scratch.ArgumentType.STRING, defaultValue: 'ja-JP' }
            }
          }
        ]
      };
    }

    async timeoutFetch(url, options = {}, timeout = 3000) {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
      ]);
    }

    extractLangCode(code) {
      return (code || '').split('-')[0].toLowerCase();
    }

    async checkOnline() {
      try {
        const res = await fetch('https://extensions.turbowarp.org/hello.txt', {
          method: 'HEAD',
          cache: 'no-store'
        });
        return res.ok;
      } catch {
        return false;
      }
    }

    async translateWithLingva(args) {
      const text = args.TEXT;
      const from = this.extractLangCode(args.FROM || 'auto');
      const to = this.extractLangCode(args.TO);

      if (!(await this.checkOnline())) {
        return null;
      }

      const url = `https://lingva.ml/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
      try {
        const res = await this.timeoutFetch(url);
        const data = await res.json();
        return data.translation || 'Error';
      } catch (e) {
        console.warn(${e.message});
        return 'Error';
      }
    }

    async translateWithGoogle(args) {
      const text = args.TEXT;
      const from = this.extractLangCode(args.FROM || 'auto');
      const to = this.extractLangCode(args.TO);

      if (!(await this.checkOnline())) {
        return null;
      }

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      try {
        const res = await this.timeoutFetch(url);
        const data = await res.json();
        return (data[0] && data[0][0] && data[0][0][0]) || 'Error';
      } catch (e) {
        console.warn(${e.message});
        return 'Error';
      }
    }

  }

  Scratch.extensions.register(new Translate());
})(Scratch);
