// Name: Chain Translate
// Image: ./assets/extensions-images/chaintranslate.png
// New: true
// Author: XmerOriginals
// ID: chaintranslate
// Description: It allows you to translate with translation APIs, if the API you use does not return a response, it automatically redirects to another, if that one does not return a response, it redirects to another. If it does not come after 6 chained attempts with 3 APIs, it returns empty, it tries to respond as much as possible. (If you have not exceeded the limit on your IP, the response usually comes.)
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  class ChainTranslate {
    getInfo() {
      return {
        id: 'chaintranslate',
        name: 'Chain Translate',
        color1: '#5b5ffc',
        blocks: [
          {
            opcode: 'translateWithMyMemory',
            blockType: Scratch.BlockType.REPORTER,
            text: '(unreliable translation) MyMemory translate text [TEXT] [FROM] to [TO]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world!' },
              FROM: { type: Scratch.ArgumentType.STRING, defaultValue: 'en-EN' },
              TO: { type: Scratch.ArgumentType.STRING, defaultValue: 'fr-FR' }
            }
          },
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

    async translateWithMyMemory(args, attemptCount = 1) {
      if (attemptCount > 6) return 'Error';
      const text = args.TEXT;
      const from = this.extractLangCode(args.FROM || 'auto');
      const to = this.extractLangCode(args.TO);
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      try {
        const res = await this.timeoutFetch(url);
        const data = await res.json();
        if (data.responseData.translatedText) {
          return data.responseData.translatedText;
        } else {
          throw new Error('Empty');
        }
      } catch (e) {
        if (!navigator.onLine) return '/\\no internet connection/\\';
        console.warn(`MyMemory ${e.message}`);
        return await this.tryFallbacks(text, from, to, ['lingva', 'google'], attemptCount);
      }
    }

    async translateWithLingva(args, attemptCount = 1) {
      if (attemptCount > 6) return 'Error';
      const text = args.TEXT;
      const from = this.extractLangCode(args.FROM || 'auto');
      const to = this.extractLangCode(args.TO);
      const url = `https://lingva.ml/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
      try {
        const res = await this.timeoutFetch(url);
        const data = await res.json();
        if (data.translation) {
          return data.translation;
        } else {
          throw new Error('Empty');
        }
      } catch (e) {
        if (!navigator.onLine) return '/\\no internet connection/\\';
        console.warn(`Lingva ${e.message}`);
        return await this.tryFallbacks(text, from, to, ['google', 'mymemory'], attemptCount);
      }
    }

    async translateWithGoogle(args, attemptCount = 1) {
      if (attemptCount > 6) return 'Error';
      const text = args.TEXT;
      const from = this.extractLangCode(args.FROM || 'auto');
      const to = this.extractLangCode(args.TO);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      try {
        const res = await this.timeoutFetch(url);
        const data = await res.json();
        if (data[0] && data[0][0] && data[0][0][0]) {
          return data[0][0][0];
        } else {
          throw new Error('Empty');
        }
      } catch (e) {
        if (!navigator.onLine) return '/\\no internet connection/\\';
        console.warn(`Google ${e.message}`);
        return await this.tryFallbacks(text, from, to, ['mymemory', 'lingva'], attemptCount);
      }
    }

    async tryFallbacks(text, from, to, order, attemptCount = 1) {
      if (attemptCount > 6 || !navigator.onLine) return 'Error';
      for (const api of order) {
        try {
          if (api === 'mymemory') {
            return await this.translateWithMyMemory({ TEXT: text, FROM: from, TO: to }, attemptCount + 1);
          } else if (api === 'lingva') {
            return await this.translateWithLingva({ TEXT: text, FROM: from, TO: to }, attemptCount + 1);
          } else if (api === 'google') {
            return await this.translateWithGoogle({ TEXT: text, FROM: from, TO: to }, attemptCount + 1);
          }
        } catch (e) {
          console.warn(`${api} No APIs responded: ${e.message}`);
        }
      }
      return 'Error';
    }

  }

  Scratch.extensions.register(new ChainTranslate());
})(Scratch);
