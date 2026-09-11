// Audio Player Engine: Real Audio Preview Streaming + Web Audio Synthesizer Fallback
import type { MusicTrack } from './types';

export class AudioPlayerController {
  private audioElement: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private synthInterval: number | null = null;
  private isPlaying: boolean = false;
  private currentTrack: MusicTrack | null = null;
  private volume: number = 0.85;
  private currentTime: number = 0;
  private duration: number = 30; // Previews are typically 30s
  private progressTimer: number | null = null;
  private onStateChangeCallbacks: Array<(isPlaying: boolean, currentTime: number, duration: number) => void> = [];

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.crossOrigin = 'anonymous';

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = Math.floor(this.audioElement.currentTime);
      if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
        this.duration = Math.floor(this.audioElement.duration);
      }
      this.notify();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.notify();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Preview stream playback issue, activating synthesizer fallback:', e);
      if (this.isPlaying && this.currentTrack) {
        this.startProceduralAudio(this.currentTrack.synthPreset);
      }
    });
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public subscribe(cb: (isPlaying: boolean, currentTime: number, duration: number) => void) {
    this.onStateChangeCallbacks.push(cb);
  }

  private notify() {
    for (const cb of this.onStateChangeCallbacks) {
      cb(this.isPlaying, this.currentTime, this.duration);
    }
  }

  /**
   * Play procedural genre synth loop for offline / synthesizer fallback
   */
  private startProceduralAudio(preset?: string) {
    this.stopProceduralAudio();
    this.initAudioContext();
    if (!this.audioCtx) return;

    let step = 0;
    const tempoMs =
      preset === 'rage'
        ? 420
        : preset === 'kuthu'
        ? 390
        : preset === 'ambient'
        ? 800
        : preset === 'lofi'
        ? 650
        : preset === 'melody'
        ? 580
        : 500;

    const playTone = (freq: number, type: OscillatorType, dur: number, vol = 0.15) => {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const targetVol = vol * this.volume;
        gain.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + dur);
      } catch {}
    };

    this.synthInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      step = (step + 1) % 8;

      if (preset === 'rage') {
        if (step % 2 === 0) playTone(55, 'sawtooth', 0.4, 0.25);
        if (step === 2 || step === 6) playTone(440, 'triangle', 0.2, 0.1);
        if (step === 4) playTone(330, 'square', 0.3, 0.08);
      } else if (preset === 'kuthu') {
        if (step % 2 === 0) playTone(65, 'sine', 0.28, 0.32);
        if (step === 1 || step === 5) playTone(587.33, 'sawtooth', 0.14, 0.15);
        if (step === 3 || step === 7) playTone(880, 'triangle', 0.1, 0.12);
      } else if (preset === 'melody') {
        const ragaNotes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
        if (step % 2 === 0) playTone(ragaNotes[(step / 2) % ragaNotes.length], 'sine', 0.55, 0.18);
        if (step === 0 || step === 4) playTone(146.83, 'triangle', 0.6, 0.14);
      } else if (preset === 'lofi') {
        const chords = [261.63, 329.63, 392.0, 493.88];
        if (step % 2 === 0) playTone(chords[(step / 2) % chords.length], 'sine', 0.6, 0.12);
        if (step === 0 || step === 4) playTone(65.41, 'triangle', 0.5, 0.15);
      } else if (preset === 'ambient') {
        if (step === 0) playTone(220, 'sine', 1.2, 0.12);
        if (step === 4) playTone(277.18, 'sine', 1.2, 0.12);
      } else if (preset === 'jazz') {
        const bass = [82.41, 110.0, 123.47, 146.83];
        playTone(bass[step % 4], 'triangle', 0.35, 0.18);
        if (step % 2 === 1) playTone(587.33, 'sine', 0.15, 0.06);
      } else {
        if (step === 0) playTone(60, 'sine', 0.45, 0.28);
        if (step === 3) playTone(75, 'sawtooth', 0.3, 0.2);
        if (step === 2 || step === 6) playTone(800, 'triangle', 0.08, 0.08);
      }
    }, tempoMs);
  }

  private stopProceduralAudio() {
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public playTrack(track: MusicTrack, autoPlay: boolean = true) {
    this.currentTrack = track;
    this.currentTime = 0;
    this.duration = 30;

    // Reset previous playback sources
    this.stopProceduralAudio();
    this.stopProgressTicker();

    if (track.audioPreviewUrl) {
      this.audioElement.src = track.audioPreviewUrl;
      this.audioElement.volume = this.volume;

      if (autoPlay) {
        this.isPlaying = true;
        this.audioElement.play().catch((err) => {
          console.warn('Real audio preview play was prevented (user gesture needed):', err);
        });
      } else {
        this.isPlaying = false;
        this.audioElement.pause();
      }
    } else {
      // Fall back to synth preset if no preview URL is available
      if (autoPlay) {
        this.isPlaying = true;
        this.startProceduralAudio(track.synthPreset);
        this.startProgressTicker();
      } else {
        this.isPlaying = false;
      }
    }

    this.notify();
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
    return this.isPlaying;
  }

  public resume() {
    if (!this.currentTrack) return;
    this.isPlaying = true;

    if (this.currentTrack.audioPreviewUrl && this.audioElement.src) {
      this.audioElement.play().catch((e) => {
        console.warn('Could not resume preview, falling back to synth:', e);
        this.startProceduralAudio(this.currentTrack?.synthPreset);
        this.startProgressTicker();
      });
    } else {
      this.startProceduralAudio(this.currentTrack.synthPreset);
      this.startProgressTicker();
    }

    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProceduralAudio();
    this.stopProgressTicker();
    this.notify();
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.audioElement && this.audioElement.src && !this.synthInterval) {
      this.audioElement.currentTime = this.currentTime;
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): MusicTrack | null {
    return this.currentTrack;
  }

  private startProgressTicker() {
    this.stopProgressTicker();
    this.progressTimer = window.setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 1;
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
        }
        this.notify();
      }
    }, 1000);
  }

  private stopProgressTicker() {
    if (this.progressTimer !== null) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }
}

export const audioPlayer = new AudioPlayerController();
