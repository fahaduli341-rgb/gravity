/**
 * Subtle audio synthesizer using Web Audio API for gravitational sound effects
 */

class GravityAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playOrbTone(freq: number = 340, duration: number = 0.6) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy gracefully handled
    }
  }

  public playGravityPulse() {
    if (!this.enabled) return;
    this.playOrbTone(220, 0.9);
  }

  public playTorusTone() {
    if (!this.enabled) return;
    this.playOrbTone(440, 0.7);
  }

  public playMiniTone() {
    if (!this.enabled) return;
    this.playOrbTone(660, 0.5);
  }
}

export const gravityAudio = new GravityAudio();
