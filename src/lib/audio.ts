export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slower for cognitive ease
    utterance.pitch = 1.1; // Friendly pitch
    window.speechSynthesis.speak(utterance);
  }
};

export const playSound = (type: 'success' | 'error' | 'complete' | string) => {
  // Always try to play local mp3 first if it's a known type
  const localFile = type === 'success' ? '/sounds/success.mp3' : 
                    type === 'error' ? '/sounds/error.mp3' : null;

  if (localFile) {
    const audio = new Audio(localFile);
    audio.play()
      .then(() => {
        // Success playing file
      })
      .catch(() => {
        // Fallback to generated tones
        generateTone(type as any);
      });
  } else {
    // If it's a specific file path or unknown type
    if (type.includes('.mp3') || type.startsWith('/') || type.startsWith('http')) {
      const audio = new Audio(type);
      audio.play().catch(e => console.warn("Failed to play audio:", type, e));
    } else {
      generateTone(type as any);
    }
  }
};

const generateTone = (type: 'success' | 'error' | 'complete') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
