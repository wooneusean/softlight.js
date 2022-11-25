/// <reference types="vite/client" />
import SoftLight from './softlight';

interface CustomEventMap {
    medialoaded: CustomEvent<HTMLImageElement | HTMLVideoElement>;
}

declare global {
    interface EventTarget {
        addEventListener<K extends keyof CustomEventMap>(
            type: K,
            listener: (this: SoftLight, ev: CustomEventMap[K]) => void
        ): void;
    }
}

export {};
