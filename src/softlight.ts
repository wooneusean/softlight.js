import './softlight.scss';

export interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
    [index: string]: number;
}

export interface SoftLightOptions {
    blurRadius: number;
}

export default class SoftLight extends EventTarget {
    private element: HTMLElement;
    private canvas: HTMLCanvasElement;
    private media?: HTMLImageElement | HTMLVideoElement;
    public options: SoftLightOptions;

    constructor(
        element: HTMLElement | string,
        options: SoftLightOptions = {
            blurRadius: 50,
        }
    ) {
        super();

        this.options = options;

        let e: any = element;
        if (typeof element === 'string') {
            e = document.querySelector<HTMLImageElement | HTMLVideoElement>(
                element
            );
            if (!e) {
                throw new Error(
                    'There are no elements with this selector: ' + element
                );
            }
        }

        this.element = e;
        this.element.classList.add('softlight');

        let existingCanvas = this.element.querySelector('canvas');
        if (existingCanvas == null) {
            this.canvas = document.createElement('canvas');
            this.element.prepend(this.canvas);
        } else {
            this.canvas = existingCanvas;
        }

        let softLightMedia:
            | HTMLImageElement
            | HTMLVideoElement
            | HTMLIFrameElement
            | null
            | undefined =
            this.element.querySelector('img') ??
            this.element.querySelector('video') ??
            this.element.querySelector('iframe');

        if (softLightMedia == null) {
            throw new Error(
                'There are no img, video, or iframe elements within this SoftLight element.'
            );
        }

        this.addEventListener('medialoaded', this.handleMediaLoaded.bind(this));

        if (softLightMedia instanceof HTMLIFrameElement) {
            softLightMedia.onload = this.handleIframeDocumentLoad.bind(this);
        } else {
            const mediaLoadedEvent = new CustomEvent('medialoaded', {
                detail: softLightMedia,
            });
            this.dispatchEvent(mediaLoadedEvent);
        }
    }

    handleIframeDocumentLoad(e: Event) {
        if (!(e.target instanceof HTMLIFrameElement)) return;

        const iframeDocument: Document | null = e.target.contentDocument;
        if (iframeDocument == null) {
            throw new Error('Document not found within iframe.');
        }

        const iframeMedia =
            iframeDocument.querySelector('video') ||
            iframeDocument.querySelector('img');

        if (iframeMedia == null) {
            throw new Error(
                'There are no video or img elements within this iframe element.'
            );
        }

        const mediaLoadedEvent = new CustomEvent('medialoaded', {
            detail: iframeMedia,
        });
        this.dispatchEvent(mediaLoadedEvent);
    }

    handleMediaLoaded(evt: CustomEvent<HTMLImageElement | HTMLVideoElement>) {
        this.media = evt.detail;

        this.media.onload = this.update.bind(this);

        if (this.media instanceof HTMLVideoElement) {
            this.media.onplay = () => {
                window.requestAnimationFrame(this.update.bind(this));
            };

            this.media.onpause = () => {
                window.requestAnimationFrame(this.update.bind(this));
            };

            this.media.onloadeddata = this.update.bind(this);
            // this.media.ontimeupdate = this.update.bind(this);
        }
    }

    getMediaBoundingClientRect(m: HTMLImageElement | HTMLVideoElement) {
        if (m.ownerDocument === document) {
            return m.getBoundingClientRect();
        }

        const mediaIframe = m.ownerDocument.defaultView?.frameElement;
        if (mediaIframe == null) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
        }

        return mediaIframe.getBoundingClientRect();
    }

    getMediaIframe(
        m: HTMLImageElement | HTMLVideoElement
    ): HTMLIFrameElement | null | undefined {
        if (m.ownerDocument === document) {
            return null;
        }

        return m.ownerDocument.defaultView?.frameElement as HTMLIFrameElement;
    }

    update() {
        const {
            x: eX,
            y: eY,
            width: eW,
            height: eH,
        } = this.element.getBoundingClientRect();
        this.canvas.width = eW;
        this.canvas.height = eH;

        if (this.media == null) return;

        const {
            x: iX,
            y: iY,
            width: iW,
            height: iH,
        } = this.getMediaBoundingClientRect(this.media);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Cannot get context for canvas.');

        ctx.drawImage(this.media, iX - eX, iY - eY, iW, iH);
        this.canvas.style.filter = `blur(${this.options.blurRadius}px)`;

        if (this.media instanceof HTMLVideoElement) {
            if (this.media.paused === true) return;

            window.requestAnimationFrame(this.update.bind(this));
        }
    }
}
