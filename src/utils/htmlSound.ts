import { getAudioSettings } from "@/config/AudioSettings";

const clickSound = new Audio("/src/assets/Audio/Click_UI.mp3");

export function playClickSound() {
  const { sfxVolume, muted } = getAudioSettings();

  clickSound.volume = muted ? 0 : sfxVolume;
  clickSound.currentTime = 0;

  clickSound.play().catch(() => {});
}
