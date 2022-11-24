import "./softlight.scss";

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

export default class SoftLight {
    private element: HTMLElement;
    private canvas: HTMLCanvasElement;
    private media: HTMLImageElement | HTMLVideoElement;
    public options: SoftLightOptions;

    constructor(
        element: HTMLElement | string,
        options: SoftLightOptions = {
            blurRadius: 50,
        }
    ) {
        this.options = options;

        let e: any = element;
        if (typeof element === "string") {
            e = document.querySelector<HTMLImageElement | HTMLVideoElement>(
                element
            );
            if (!e) {
                throw new ReferenceError(
                    "There are no elements with this selector: " + element
                );
            }
        }

        this.element = e;
        this.element.classList.add("softlight");

        let canvas = this.element.querySelector("canvas");
        if (canvas === null) {
            throw new ReferenceError(
                "There are no canvas elements within this SoftLight element."
            );
        }

        // iframe to handle youtube video (but why tho)
        let m:
            | HTMLImageElement
            | HTMLVideoElement
            | HTMLIFrameElement
            | null
            | undefined =
            this.element.querySelector("img") ??
            this.element.querySelector("video") ??
            this.element.querySelector("iframe");
        if (m === null) {
            throw new ReferenceError(
                "There are no img, video, or iframe elements within this SoftLight element."
            );
        }
        // TODO: Wait til iframe is loaded, then proceed.
        this.canvas = canvas;
        if (m instanceof HTMLIFrameElement) {
            m = m.contentWindow?.document.querySelector("video");
        }

        if (m === null || m === undefined) {
            throw new ReferenceError(
                "There are no video elements within this iframe element."
            );
        }

        this.media = m;

        if (this.media instanceof HTMLImageElement) {
            this.media.onload = this.update.bind(this);
        } else {
            this.media.onseeked = this.update.bind(this);
            this.media.ontimeupdate = this.update.bind(this);
            setTimeout(() => {
                const seekedEvent = new Event("seeked");
                this.media.dispatchEvent(seekedEvent);
            }, 250);
        }
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

        const {
            x: iX,
            y: iY,
            width: iW,
            height: iH,
        } = this.media.getBoundingClientRect();

        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("Cannot get context for canvas.");

        ctx.drawImage(this.media, iX - eX, iY - eY, iW, iH);
        this.canvas.style.filter = `blur(${this.options.blurRadius}px)`;
    }
}
