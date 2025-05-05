// Name: Sound Player+
// Image: ./assets/extensions-images/soundplayerplus.png
// ID: soundplayerplus
// Description: Best way to launch audio from URL or data uri's. 10 channels and bass levels for your equalizer. Apart from basic functions like audio file control; control device media playback, check if next or previous media is clicked, set image, title, description. Get full control over stop/start on your Project in Device Media Session.
// License: MPL-2.0
// v2

class SoundPlayerPlusv2 {
  constructor() {
    this.playingSounds = new Map();
    this.currentSoundURL = "";
    this.isPlaying = false;
    this.errorStatus = "";
    this.waitingPromise = null;
    this.volume = 100;
    this.paused = false;
    this.pausedTime = 0;
    this.audioContext = null;
    this.analyser = null;
    this.frequencyData = null;
    this.currentlyPlaying = {};
    this.nextMediaRequested = false;
    this.previousMediaRequested = false;
    this.mediaControlsEnabled = false;
    this.allAudios = [];
  }

  getInfo() {
    return {
      id: "soundplayerplusv2",
      name: "Sound Player+",
      color1: "#fc760a",
      blocks: [
        {
          opcode: "playSound",
          blockType: Scratch.BlockType.COMMAND,
          text: "play sound url or data uri [url]",
          arguments: {
            url: {
              type: Scratch.ArgumentType.STRING,
              defaultValue:
                "https://audio.jukehost.co.uk/XsrI9yQUnun5WN362jqCMvUnrQbj5lxh",
            },
          },
        },
        {
          opcode: "playSoundAndWait",
          blockType: Scratch.BlockType.COMMAND,
          text: "play sound url or data uri[url] and wait",
          arguments: {
            url: {
              type: Scratch.ArgumentType.STRING,
              defaultValue:
                "https://audio.jukehost.co.uk/XsrI9yQUnun5WN362jqCMvUnrQbj5lxh",
            },
          },
        },
        {
          opcode: "stopSound",
          blockType: Scratch.BlockType.COMMAND,
          text: "stop sound",
        },
        {
          opcode: "stopAllSounds",
          blockType: Scratch.BlockType.COMMAND,
          text: "stop all sound",
        },
        {
          opcode: "pauseSound",
          blockType: Scratch.BlockType.COMMAND,
          text: "pause sound",
        },
        {
          opcode: "resumeSound",
          blockType: Scratch.BlockType.COMMAND,
          text: "resume sound",
        },
        {
          blockType: "label",
          text: "Duration",
        },
        {
          opcode: "seekSound",
          blockType: Scratch.BlockType.COMMAND,
          text: "go to time [time] seconds in sound",
          arguments: {
            time: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: "soundTime",
          blockType: Scratch.BlockType.REPORTER,
          text: "sound duration",
        },
        {
          opcode: "soundCurrentTime",
          blockType: Scratch.BlockType.REPORTER,
          text: "sound current duration",
        },
        {
          blockType: "label",
          text: "Volume",
        },
        {
          opcode: "setVolume",
          blockType: Scratch.BlockType.COMMAND,
          text: "set volume to [volume]",
          arguments: {
            volume: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
          },
        },
        {
          opcode: "getVolume",
          blockType: Scratch.BlockType.REPORTER,
          text: "get volume",
        },
        {
          blockType: "label",
          text: "Advanced and Extras",
        },
        {
          opcode: "enableMediaControls",
          blockType: Scratch.BlockType.COMMAND,
          text: "set media session controls [ENABLED]",
          arguments: {
            ENABLED: {
              type: Scratch.ArgumentType.STRING,
              menu: "mediasessionMenu",
              defaultValue: true,
            },
          },
        },
        {
          opcode: "setMediaSession",
          blockType: Scratch.BlockType.COMMAND,
          text: "set media control image to [IMAGE] with title [TITLE] artist [ARTIST] description [ALBUM]",
          arguments: {
            IMAGE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue:
                "https://xmeroriginals.github.io/xelabs/assets/XeLabsLogo.png",
            },
            TITLE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Title",
            },
            ARTIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Artist Name",
            },
            ALBUM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Description",
            },
          },
        },
        {
          opcode: "isNextMediaRequested",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is next media requested?",
        },
        {
          opcode: "isPreviousMediaRequested",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is previous media requested?",
        },
        {
          opcode: "isAudioFile",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is [URL] an audio file?",
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue:
                "https://audio.jukehost.co.uk/XsrI9yQUnun5WN362jqCMvUnrQbj5lxh",
            },
          },
        },
        {
          opcode: "getBassLevel",
          blockType: Scratch.BlockType.REPORTER,
          text: "bass level",
        },
        {
          opcode: "currentSound",
          blockType: Scratch.BlockType.REPORTER,
          text: "current sound url or data uri",
        },
        {
          opcode: "isPlayingSound",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is sound playing?",
        },
        {
          opcode: "getChannelLevel",
          blockType: Scratch.BlockType.REPORTER,
          text: "Get level of channel [channel]",
          arguments: {
            channel: {
              type: Scratch.ArgumentType.STRING,
              menu: "channelMenu",
              defaultValue: "1",
            },
          },
        },
      ],
      menus: {
        mediasessionMenu: {
          acceptReporters: false,
          items: ["true", "false"],
        },
        channelMenu: {
          acceptReporters: true,
          items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
    };
  }

  async playSound({ url }) {
    this.stopSound();
    try {
      const existingAudio = this.playingSounds.get(url);
      if (existingAudio) {
        if (
          existingAudio.paused &&
          existingAudio.currentTime < existingAudio.duration
        ) {
          await existingAudio.play();
          this.isPlaying = true;
          this.paused = false;
          return;
        }
      } else {
        this.stopSound();
      }

      const audio = new Audio();
      audio.src = url;
      audio.preload = "auto";

      if (url.startsWith("https://")) {
        audio.crossOrigin = "anonymous";
      }

      audio.volume = this.volume / 100;
      audio.addEventListener("ended", () => {
        this.isPlaying = false;
        this.currentSoundURL = "";
        if (this.waitingPromise) {
          this.waitingPromise.resolve();
          this.waitingPromise = null;
        }
      });

      this.setupAnalyser(audio);
      this.allAudios.push(audio);

      await audio.play();

      this.playingSounds.set(url, audio);
      this.currentSoundURL = url;
      this.isPlaying = true;
      this.errorStatus = "";

    } catch (error) {
      console.error("Error playing sound:", error);
      this.errorControl();
    }
  }

  async playSoundAndWait({ url }) {
    this.stopSound();
    try {
      const existingAudio = this.playingSounds.get(url);
      if (existingAudio) {
        if (
          existingAudio.paused &&
          existingAudio.currentTime < existingAudio.duration
        ) {
          await existingAudio.play();
          this.isPlaying = true;
          this.paused = false;

          return new Promise((resolve) => {
            existingAudio.addEventListener("ended", () => {
              this.isPlaying = false;
              this.currentSoundURL = "";
              resolve();
            });
            this.waitingPromise = { resolve };
          });
        }
      } else {
        this.stopSound();
      }

      return new Promise(async (resolve) => {
        const audio = new Audio();
        audio.src = url;
        audio.preload = "auto";

        if (url.startsWith("https://")) {
          audio.crossOrigin = "anonymous";
        }

        audio.volume = this.volume / 100;

        audio.addEventListener("ended", () => {
          this.isPlaying = false;
          this.currentSoundURL = "";
          resolve();
        });

        this.setupAnalyser(audio);
        this.allAudios.push(audio);

        await audio.play();

        this.playingSounds.set(url, audio);
        this.currentSoundURL = url;
        this.isPlaying = true;
        this.errorStatus = "";
        this.waitingPromise = { resolve };
      });

    } catch (error) {
      console.error("Error playing sound:", error);
      this.errorControl();
    }
  }


  stopSound() {
    if (this.playingSounds.size > 0) {
      this.playingSounds.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      this.playingSounds.clear();
      this.currentSoundURL = "";
      this.isPlaying = false;
      this.errorStatus = "";
      if (this.waitingPromise) {
        this.waitingPromise.resolve();
        this.waitingPromise = null;
      }
    }
  }

  stopAllSounds() {
    this.allAudios.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.warn("Audio stop failed:", e);
      }
    });

    this.allAudios = [];
    this.playingSounds.clear();
    this.currentSoundURL = "";
    this.isPlaying = false;
    this.paused = false;
    this.pausedTime = 0;
    this.errorStatus = "";

    if (this.waitingPromise) {
      this.waitingPromise.resolve();
      this.waitingPromise = null;
    }
  }

  pauseSound() {
    this.playingSounds.forEach((audio) => {
      if (!audio.ended && !audio.paused) {
        this.pausedTime = audio.currentTime;
        audio.pause();
        this.paused = true;
      }
    });
  }

  resumeSound() {
    const audio = this.playingSounds.get(this.currentSoundURL);
    if (audio && audio.paused && audio.currentTime < audio.duration) {
      audio.play();
      this.paused = false;
      this.isPlaying = true;
    }
  }

  currentSound() {
    return this.currentSoundURL;
  }

  soundTime() {
    if (this.playingSounds.has(this.currentSoundURL)) {
      return this.playingSounds.get(this.currentSoundURL).duration;
    }
    return 0;
  }

  soundCurrentTime() {
    if (this.playingSounds.has(this.currentSoundURL)) {
      const audio = this.playingSounds.get(this.currentSoundURL);
      return audio ? audio.currentTime : 0;
    }
    return 0;
  }

  isPlayingSound() {
    const audio = this.playingSounds.get(this.currentSoundURL);
    return !!(audio && !audio.paused && !audio.ended);
  }

  seekSound({ time }) {
    if (this.playingSounds.has(this.currentSoundURL)) {
      this.playingSounds.get(this.currentSoundURL).currentTime = time;
    }
  }

  setVolume({ volume }) {
    this.volume = Math.min(100, Math.max(0, volume));
    this.playingSounds.forEach((audio) => {
      audio.volume = this.volume / 100;
    });
  }

  getVolume() {
    return this.volume;
  }

  errorControl() {
    this.isPlaying = false;
    this.currentSoundURL = "";
    this.errorStatus = "Error";
    if (this.waitingPromise) {
      this.waitingPromise.resolve();
      this.waitingPromise = null;
    }
  }

  enableMediaControls({ ENABLED }) {
    const enabledValue = String(ENABLED).toLowerCase() === "true";
    this.mediaControlsEnabled = enabledValue;

    const mediaSession = navigator.mediaSession;
    if (!mediaSession) return;

    if (enabledValue) {
      mediaSession.setActionHandler("play", () => this.resumeSound());
      mediaSession.setActionHandler("pause", () => this.pauseSound());
      mediaSession.setActionHandler("nexttrack", () => {
        this.nextMediaRequested = true;
        setTimeout(() => {
          this.nextMediaRequested = false;
        }, 100);
      });
      mediaSession.setActionHandler("previoustrack", () => {
        this.previousMediaRequested = true;
        setTimeout(() => {
          this.previousMediaRequested = false;
        }, 100);
      });
    } else {
      mediaSession.setActionHandler("play", null);
      mediaSession.setActionHandler("pause", null);
      mediaSession.setActionHandler("nexttrack", null);
      mediaSession.setActionHandler("previoustrack", null);
    }
  }

  setMediaSession(args) {
    const { IMAGE, TITLE, ARTIST, ALBUM } = args;
    const mediaSession = navigator.mediaSession;

    if (mediaSession) {
      mediaSession.metadata = new MediaMetadata({
        title: TITLE,
        artist: ARTIST,
        album: ALBUM,
        artwork: [{ src: IMAGE, sizes: "512x512", type: "image/png" }],
      });
    }
  }

  isNextMediaRequested() {
    return this.nextMediaRequested;
  }

  isPreviousMediaRequested() {
    return this.previousMediaRequested;
  }

  isAudioFile(args) {
    const url = args.URL;
    return new Promise((resolve, reject) => {
      fetch(url, { method: "HEAD" })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          resolve(contentType && contentType.startsWith("audio/"));
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  getBassLevel() {
    if (!this.analyser || !this.frequencyData) return 0;

    this.analyser.getByteFrequencyData(this.frequencyData);

    const bassBins = Math.floor(this.frequencyData.length * 0.1);
    let sum = 0;
    for (let i = 0; i < bassBins; i++) {
      sum += this.frequencyData[i];
    }

    return Math.round(sum / bassBins);
  }

  setupAnalyser(audio) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (!this.analyser) {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.frequencyData = new Uint8Array(bufferLength);
    }

    const source = this.audioContext.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getChannelLevel({ channel }) {
    if (!this.analyser || !this.frequencyData) {
      return 0;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);

    const totalChannels = 10;
    const binSize = Math.floor(this.frequencyData.length / totalChannels);
    const ch = Math.max(1, Math.min(channel, totalChannels)) - 1;
    const start = ch * binSize;
    const end = start + binSize;

    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += this.frequencyData[i];
    }

    return Math.round(sum / (end - start));
  }
}

Scratch.extensions.register(new SoundPlayerPlusv2());
