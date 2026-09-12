export interface IAudioService {
  playAudio(text: string): Promise<void>;
  stopAudio(): void;
  setMuted(isMuted: boolean): void;
  getMuted(): boolean;
}