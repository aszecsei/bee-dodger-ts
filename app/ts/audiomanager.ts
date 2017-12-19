import { FADE_IN_TIME, FADE_OUT_TIME } from "./config";

class CAudioManager {
    public gainNode: GainNode;

    private context: AudioContext;
    private musicSource: AudioBufferSourceNode;
    private musicTime: number;

    constructor() {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this.musicTime = 0;
    }

    public async getBuffer(url: string): Promise<AudioBuffer> {
        return new Promise<AudioBuffer>((resolve) => {
            const request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = () => {
                this.context.decodeAudioData(request.response, (buffer: AudioBuffer) => {
                    resolve(buffer);
                });
            };
            request.send();
        });
    }

    public playSound(buffer: AudioBuffer) {
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);
    }

    public startMusic(buffer: AudioBuffer) {
        this.musicSource = this.context.createBufferSource();
        this.musicSource.buffer = buffer;
        this.musicSource.loop = true;
        this.musicSource.connect(this.gainNode);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + FADE_IN_TIME);
        this.musicSource.start(this.musicTime);
    }

    public stopMusic() {
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + FADE_OUT_TIME);
        this.musicSource.stop(this.context.currentTime + FADE_OUT_TIME);
        this.musicTime = 0;
    }

    public pauseMusic() {
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + FADE_OUT_TIME);
        this.musicSource.stop(this.context.currentTime + FADE_OUT_TIME);
        this.musicTime = this.context.currentTime + FADE_OUT_TIME;
    }
}

export const AudioManager = new CAudioManager();
