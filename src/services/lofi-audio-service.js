// Calming Ambient Lofi Player (Inspired by "3 AM Walk" by .diedlonely)
// High-fidelity procedural Web Audio synthesizer: Warm Rhodes electric piano chords, vinyl warmth, gentle sub-bass

class LofiMusicEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.volume = 0.35;
    this.masterGain = null;
    this.step = 0;

    // "3 AM Walk" inspired calm chord progression: Am9 -> Fmaj7 -> Cmaj7 -> Em7 / G
    this.chords = [
      // Am9: A2, E3, G3, C4, B4
      { bass: 110.00, notes: [220.00, 329.63, 392.00, 523.25, 493.88] },
      // Fmaj7: F2, C3, E3, A3, C4
      { bass: 87.31,  notes: [174.61, 261.63, 329.63, 440.00, 523.25] },
      // Cmaj7: C2, G2, B3, E4, G4
      { bass: 65.41,  notes: [130.81, 246.94, 329.63, 392.00, 523.25] },
      // Em7: E2, B2, D3, G3, B3
      { bass: 82.41,  notes: [164.81, 293.66, 392.00, 493.88, 587.33] }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master gain node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Low pass filter to create the signature muted, dreamy lofi warmth
      const lofiFilter = this.ctx.createBiquadFilter();
      lofiFilter.type = 'lowpass';
      lofiFilter.frequency.setValueAtTime(850, this.ctx.currentTime);
      lofiFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.masterGain.connect(lofiFilter);
      lofiFilter.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChord(chord) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const chordDuration = 3.8; // Slow relaxed 70 BPM breathing pace

    // 1. Play Soft Sub Bass
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord.bass, now);

    bassGain.gain.setValueAtTime(0.0, now);
    bassGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration);

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + chordDuration);

    // 2. Play Rhodes Electric Piano Notes
    chord.notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      
      // Electric piano timbre: triangle + subtle sine detune
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle humanized strum delay
      const noteDelay = idx * 0.045;
      const noteStart = now + noteDelay;

      noteGain.gain.setValueAtTime(0.0, noteStart);
      noteGain.gain.linearRampToValueAtTime(0.08 / (idx * 0.4 + 1), noteStart + 0.12);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + chordDuration - noteDelay);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + chordDuration);
    });
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const currentChord = this.chords[this.step % this.chords.length];
      this.playChord(currentChord);
      this.step++;
      this.timer = setTimeout(playNext, 3800);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const lofiMusicEngine = new LofiMusicEngine();
