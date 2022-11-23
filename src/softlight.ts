export default class SoftLight {
    private element: HTMLElement;
    private canvas?: HTMLCanvasElement;
    private img?: HTMLImageElement;

    constructor(element: HTMLElement | string) {
        let e: any = element;
        if (typeof element === "string") {
            e = document.querySelector<HTMLImageElement | HTMLVideoElement>(
                element
            );
            if (e === null) {
                throw new ReferenceError(
                    "There are no elements with this selector: " + element
                );
            }
        }

        this.element = e;
        this.init();
    }

    init() {
        let canvas = this.element.querySelector("canvas");
        if (canvas === null) {
            throw new ReferenceError(
                "There are no canvas elements within this SoftLight element."
            );
        }
        let img = this.element.querySelector("img");
        if (img === null) {
            throw new ReferenceError(
                "There are no img elements within this SoftLight element."
            );
        }
        this.canvas = canvas;
        this.img = img;

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
        } = this.img.getBoundingClientRect();
        this.canvas.getContext("2d")?.drawImage(img, iX - eX, iY - eY, iW, iH);
    }
}
