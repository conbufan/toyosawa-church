/*

    Imager

*/
export class Imager {
    //private info$element:WeakMap<HTMLImageElement,Info>;
    constructor() {
        //this.info$element = new WeakMap();
    }
    //
    // images
    //
    array() {
        const elements = document.getElementsByTagName("img");
        return Array.from(elements);
    }
    ;
    //
    //
    //
    static init(element) {
        const x = new URL(element.src);
        //console.log(x.pathname, element.naturalWidth, element.naturalHeight );
        // SVGはパス
        if (!x.pathname.endsWith(".svg")) {
            const x = element.getAttribute("data-ignore-imager");
            if (!element.getAttribute("data-ignore-imager")) {
                // data-ignore-imagerがついていない。
                // max-width / height
                if (!element.style.maxWidth && element.naturalWidth) {
                    element.style.maxWidth = String(element.naturalWidth / 2) + "px";
                    element.setAttribute("data-imager-natural-width", String(element.naturalWidth));
                }
                if (!element.style.maxHeight && element.naturalHeight) {
                    element.style.maxHeight = String(element.naturalHeight / 2) + "px";
                    element.setAttribute("data-imager-natural-height", String(element.naturalHeight));
                }
            }
            else {
                element.setAttribute("data-imager-has-ignored", String(element.naturalWidth));
            }
        }
        // 遅延許可
        element.loading = "lazy";
    }
    //
    //  個々のロード完了のコールバック、全部のロード完了のプロミス
    //
    /*
        imager.loadedAll( (element, count, max)=>{
            console.log("loaded!..", element.src, count, max );
        }).then( ()=>{
            console.log("COMPLETE!")
        });
    */
    loadedAll(onComplete) {
        const image$element = new WeakMap();
        const promises = [];
        let count = 0;
        const array = this.array();
        for (let element of array) {
            element.style.visibility = "hidden";
            element.setAttribute("data-imager-onload", "false");
            const image = new Image();
            promises.push(new Promise((resolve, reject) => {
                image.onload = ((element) => {
                    count++;
                    onComplete(element, count, array.length);
                    resolve(undefined);
                    element.style.visibility = "visible";
                    element.setAttribute("data-imager-onload", "true");
                }).bind(element, element);
            }));
            image.src = element.src;
            image$element.set(element, image);
        }
        return Promise.all(promises);
    }
}
class Item {
}
