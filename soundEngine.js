// Procedural Web Audio API Sound Synthesizer Engine
// Provides high-fidelity chimes, alerts, and ambient soundscapes without external audio files.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play notification sound
export function playAlert(soundType = 'zen', volume = 0.7) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  switch (soundType) {
    case 'zen': { // Zen Bell / Singing Bowl
      const freqs = [528, 1056, 1584];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        
        gain.gain.setValueAtTime(0.4 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 3.5);
      });
      break;
    }
    case 'bell': { // Classic Golden Bell
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(440, now + 1.8);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760, now);
      
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);
      break;
    }
    case 'digital': { // Modern Triple Success Chime
      const notes = [587.33, 739.99, 880]; // D5, F#5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.12;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
      break;
    }
    case 'marimba': { // Marimba Upbeat Arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.09;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
      break;
    }
    default:
      break;
  }
}

// Subtle Click sound for buttons
export function playClick(volume = 0.2) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
  
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

// Gentle Metronome / Soft Tick sound
export function playTick(volume = 0.1) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, now);
  
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.02);
}

// Ambient Noise Generator Class
class AmbientSynthesizer {
  constructor() {
    this.currentMode = null;
    this.nodes = [];
    this.masterGain = null;
    this.volume = 0.5;
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.masterGain && audioCtx) {
      this.masterGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.1);
    }
  }

  stop() {
    if (this.nodes.length > 0) {
      this.nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {
          // ignore
        }
      });
      this.nodes = [];
    }
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch (e) {}
      this.masterGain = null;
    }
    this.currentMode = null;
  }

  start(mode, volume = 0.4) {
    this.stop();
    const ctx = getAudioContext();
    if (!ctx) return;

    this.currentMode = mode;
    this.volume = volume;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (mode === 'brown_noise') {
      // Brown Noise (Deep focus)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // boost
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.masterGain);
      noise.start();
      this.nodes.push(noise, filter);
    } else if (mode === 'rain') {
      // Procedural Gentle Rain
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(300, ctx.currentTime);

      noise.connect(filter);
      filter.connect(highpass);
      highpass.connect(this.masterGain);
      noise.start();
      this.nodes.push(noise, filter, highpass);
    } else if (mode === 'waves') {
      // Ocean Waves (Modulated Pink/Brown Noise)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.0;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

      // Low frequency oscillator for wave swell
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave period
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      noise.start();
      lfo.start();
      this.nodes.push(noise, filter, gainNode, lfo, lfoGain);
    } else if (mode === 'binaural') {
      // Alpha Wave Focus (432Hz Carrier + 10Hz Alpha differential)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(216, ctx.currentTime); // Left

      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(226, ctx.currentTime); // Right (+10Hz Alpha wave)

      const gainL = ctx.createGain();
      const gainR = ctx.createGain();
      gainL.gain.setValueAtTime(0.3, ctx.currentTime);
      gainR.gain.setValueAtTime(0.3, ctx.currentTime);

      oscL.connect(gainL);
      gainL.connect(merger, 0, 0);

      oscR.connect(gainR);
      gainR.connect(merger, 0, 1);

      merger.connect(this.masterGain);
      oscL.start();
      oscR.start();
      this.nodes.push(oscL, oscR, gainL, gainR, merger);
    }
  }
}

export const ambientPlayer = new AmbientSynthesizer();
