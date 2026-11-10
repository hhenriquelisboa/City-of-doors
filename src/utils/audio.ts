// Procedural Web Audio API sound generator for RPG effects
class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactile Dice Roll sound (tumbling dice clicks and final heavier thump)
  public playDiceRoll(isCrit = false, isFumble = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const clicks = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < clicks; i++) {
      const clickTime = now + (i * 0.04) + (Math.random() * 0.03);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 500, clickTime);
      osc.frequency.exponentialRampToValueAtTime(100, clickTime + 0.04);

      gain.gain.setValueAtTime(0.12, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.05);
    }

    // Final result thump
    const finalTime = now + 0.28;
    const finalOsc = this.ctx.createOscillator();
    const finalGain = this.ctx.createGain();

    if (isCrit) {
      // Fanfare chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, finalTime + idx * 0.06);
        chimeGain.gain.setValueAtTime(0.15, finalTime + idx * 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, finalTime + idx * 0.06 + 0.35);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chimeOsc.start(finalTime + idx * 0.06);
        chimeOsc.stop(finalTime + idx * 0.06 + 0.4);
      });
    } else if (isFumble) {
      // Low ominous rumble
      finalOsc.type = 'sawtooth';
      finalOsc.frequency.setValueAtTime(140, finalTime);
      finalOsc.frequency.exponentialRampToValueAtTime(45, finalTime + 0.4);
      finalGain.gain.setValueAtTime(0.2, finalTime);
      finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.4);
      finalOsc.connect(finalGain);
      finalGain.connect(this.ctx.destination);
      finalOsc.start(finalTime);
      finalOsc.stop(finalTime + 0.45);
    } else {
      // Normal wood landing
      finalOsc.type = 'sine';
      finalOsc.frequency.setValueAtTime(220, finalTime);
      finalOsc.frequency.exponentialRampToValueAtTime(80, finalTime + 0.12);
      finalGain.gain.setValueAtTime(0.18, finalTime);
      finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.12);
      finalOsc.connect(finalGain);
      finalGain.connect(this.ctx.destination);
      finalOsc.start(finalTime);
      finalOsc.stop(finalTime + 0.15);
    }
  }

  // Pin placement or click sound (parchment tap)
  public playPinClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Fog Reveal sound (magical sweep)
  public playFogReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.22);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Measure ruler node click
  public playRulerPing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Procedural Fantasy Ambience (warm wind & campfire drone)
  public toggleAtmosphere(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying) {
      if (this.ambientSource) {
        try {
          this.ambientSource.stop();
          this.ambientSource.disconnect();
        } catch {
          // ignore
        }
      }
      this.isAmbientPlaying = false;
      return false;
    }

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 0.4;
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      // Low pass filter for soft fantasy breeze
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientSource.start();
      this.isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const sound = new SoundController();
