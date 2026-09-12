import type { IAudioService } from "../interfaces/IAudioService";

export class BrowserAudioService implements IAudioService {
  private isMuted = false;

  async playAudio(text: string): Promise<void> {
    if (this.isMuted) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error(
        "Speech synthesis is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  stopAudio(): void {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  setMuted(isMuted: boolean): void {
    this.isMuted = isMuted;

    if (isMuted) {
      this.stopAudio();
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

export const browserAudioService =
  new BrowserAudioService();