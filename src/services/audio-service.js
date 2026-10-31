// Web Audio API Procedural Sound Engine
// Zero latency, high fidelity, works offline without external asset downloads

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.hapticEnabled = true;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Bead click sound: crisp ceramic/stone/crystal impact
  playBeadClick(variation = 0) {
    if (!this.soundEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch variation slightly per tap for realistic organic tactile feel
      const baseFreq = 880 + (Math.sin(variation) * 45); // A5 note range
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.05);

      // Attack and exponential decay
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      // Subtle bandpass filter for wooden/pearl resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch (e) {
      console.warn('Audio play error:', e);
    }

    // Trigger haptic vibration if supported (Safari iOS & Android)
    if (this.hapticEnabled && navigator.vibrate) {
      try {
        navigator.vibrate(18);
      } catch (err) {}
    }
  }

  // Realistic water drop sound (plop/bloop) for mobile oasis mode
  playWaterDrop() {
    if (!this.soundEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Rapid upward pitch sweep creates the natural organic droplet bloop
      const baseFreq = 1050 + (Math.random() * 80);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.75, now + 0.07);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}

    if (this.hapticEnabled && navigator.vibrate) {
      try {
        navigator.vibrate(16);
      } catch (err) {}
    }
  }

  // Milestone completion chime (when reaching 33, 99, 100)
  playCompletionChime() {
    if (!this.soundEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Celestial harmonic chord (C5, G5, C6)
      const frequencies = [523.25, 659.25, 783.99, 1046.50];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.0, now + delay);
        gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.85);
      });
    } catch (e) {
      console.warn('Chime error:', e);
    }

    if (this.hapticEnabled && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40, 60, 100]);
      } catch (err) {}
    }
  }

  // Soft interface tap
  playSoftTap() {
    if (!this.soundEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleHaptic() {
    this.hapticEnabled = !this.hapticEnabled;
    return this.hapticEnabled;
  }
}

export const soundEngine = new SoundEngine();
