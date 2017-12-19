import { AudioManager } from "./audiomanager";

const images = new Map<string, HTMLImageElement>();
const audio = new Map<string, AudioBuffer>();

export function getAudio(name: string): AudioBuffer {
    return audio.get(name);
}

export function getImage(name: string): HTMLImageElement {
    return images.get(name) as HTMLImageElement;
}

export function loadImage(name: string, path: string) {
    const img = new Image();
    img.src = path;
    images.set(name, img);
}

export function loadAudio(name: string, path: string) {
    AudioManager.getBuffer(path)
        .then((buffer: AudioBuffer) => audio.set(name, buffer));
}
