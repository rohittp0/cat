// An original little pentatonic tune, synthesized locally. No audio downloads.
export function createAudio({ enabled = true, onUnavailable = () => {} } = {}) {
  const melody = [72, 76, 79, 81, 79, 76, 74, 0, 76, 79, 84, 81, 79, 0, 76, 74,
    72, 74, 76, 79, 76, 74, 72, 0, 67, 72, 74, 76, 74, 72, 0, 0];
  const bass = [48, 45, 53, 43];
  const voices = new Set();
  let context, master, timer = null, step = 0, nextNote = 0;
  let unlocked = false, musicWanted = true;
  const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

  function note(midi, at, duration = 0.24, volume = 0.11, type = 'triangle', meow = false) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency(midi), at);
    if (meow) {
      oscillator.frequency.exponentialRampToValueAtTime(frequency(midi + 7), at + 0.09);
      oscillator.frequency.exponentialRampToValueAtTime(frequency(midi + 2), at + duration);
    }
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(gain);
    gain.connect(master);
    voices.add(oscillator);
    oscillator.onended = () => { voices.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(at);
    oscillator.stop(at + duration + 0.025);
  }
  function stopMusic() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }
  function silence() {
    stopMusic();
    if (!context) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(0, context.currentTime);
    for (const voice of voices) { try { voice.stop(); } catch { /* Already ended. */ } }
    voices.clear();
  }
  function scheduleNotes() {
    if (!enabled || !musicWanted || context.state !== 'running') return;
    nextNote = Math.max(nextNote, context.currentTime + 0.015);
    while (nextNote < context.currentTime + 0.18) {
      const index = step % melody.length;
      if (melody[index]) note(melody[index], nextNote);
      if (index % 8 === 0) note(bass[index / 8], nextNote, 0.65, 0.085, 'sine');
      nextNote += 0.25;
      step++;
    }
  }
  async function activate() {
    if (!enabled || !unlocked || !musicWanted) return;
    try {
      if (context.state !== 'running') await context.resume();
      if (!enabled || !musicWanted || timer !== null) return;
      master.gain.setValueAtTime(0.34, context.currentTime);
      nextNote = context.currentTime + 0.035;
      scheduleNotes();
      timer = setInterval(scheduleNotes, 100);
    } catch { enabled = false; silence(); onUnavailable(); }
  }
  return {
    async unlock() {
      if (!enabled) return;
      try {
        if (!context) {
          const Context = window.AudioContext || window.webkitAudioContext;
          if (!Context) throw new Error('Audio unavailable');
          context = new Context();
          master = context.createGain();
          master.gain.setValueAtTime(0, context.currentTime);
          master.connect(context.destination);
        }
        unlocked = true;
        await activate();
      } catch { enabled = false; silence(); onUnavailable(); }
    },
    catch(value) {
      if (!enabled || !unlocked || !musicWanted || context.state !== 'running') return;
      const at = context.currentTime;
      if (value === 3) note(81, at, 0.24, 0.14, 'sine', true);
      else {
        note(value === 2 ? 84 : 88, at, 0.16, 0.13, 'sine');
        if (value === 2) note(91, at + 0.07, 0.18, 0.1, 'sine');
      }
    },
    finish() {
      musicWanted = false;
      silence();
      if (!enabled || !unlocked || context.state !== 'running') return;
      master.gain.setValueAtTime(0.34, context.currentTime);
      [76, 79, 84, 88, 84].forEach((midi, index) => note(midi, context.currentTime + index * 0.12, index === 4 ? 0.6 : 0.22, 0.12, 'sine'));
    },
    pause() { musicWanted = false; silence(); },
    resume() { musicWanted = true; activate(); },
    setEnabled(next) { enabled = next; if (!next) silence(); else activate(); },
  };
}
