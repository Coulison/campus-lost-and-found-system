// Sound Engine (Silenced / No Sound Effects)
// All audio functions are safe no-ops to ensure a quiet, distraction-free experience.

export function playAlert(soundType = 'zen', volume = 0) {
  // Silenced
}

export function playClick(volume = 0) {
  // Silenced
}

export function playTick(volume = 0) {
  // Silenced
}

class SilentAmbientSynthesizer {
  constructor() {
    this.currentMode = null;
    this.volume = 0;
  }
  setVolume(vol) {}
  stop() {}
  start(mode, volume = 0) {}
}

export const ambientPlayer = new SilentAmbientSynthesizer();
