const useSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playFlapSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return playFlapSound;
};

export default useSound;
