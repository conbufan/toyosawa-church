//
//
//
console.log("start index.js!");
import { Scroller } from "./Scroller/index.js";
import { Imager } from "./Imager/index.js";
import { TemplateLoader } from "./TemplateLoader/index.js";
//
//
//
const progressBar = document.getElementById("progress-bar");
//
//
//
//
//    フッターなど共通要素をを読み込む => HTML中の画像を読み込む。
//
Promise.all([
    // 共通要素をを読み込む
    TemplateLoader("./assets/templates/footer.html"),
    TemplateLoader("./assets/templates/header.html"),
    TemplateLoader("./assets/templates/common.html"),
    //TemplateLoader("./assets/templates/spmenu.html"),
    TemplateLoader("./assets/templates/gotop.html"),
]).then((res) => {
    console.log("in index.js, all TemplateLoaders have done!");
    // 共通要素ををHTMLに描画
    const template = {
        footer: res[0],
        header: res[1],
        common: res[2],
        // spmenu: res[3],
        gotop: res[3],
    };
    const footer = document.getElementsByTagName("footer")[0];
    const header = document.getElementsByTagName("header")[0];
    const main = document.getElementsByTagName("main")[0];
    // 共通要素を、対象要素があれば設置する。
    if (footer && template.footer) {
        for (let child of Array.from(template.footer)) {
            footer.appendChild(child);
        }
    }
    if (header && template.header) {
        for (let child of Array.from(template.header)) {
            header.appendChild(child);
        }
    }
    if (template.common) {
        for (let child of Array.from(template.common)) {
            main.before(child);
        }
    }
    /*
    if ( template.spmenu ){
        for ( let child of Array.from(template.spmenu) ){
            main.before( child );
        }
    }
    */
    const gotop = document.getElementById("footer-gotop");
    if (gotop && template.gotop) {
        for (let child of Array.from(template.gotop)) {
            gotop.appendChild(child);
        }
    }
    console.log("in index.js, all TemplateLoaders have set.");
    // HTML中の画像を取得、リモートからの読み込みを監視
    const imager = new Imager();
    imager.loadedAll((element, count, max) => {
        Imager.init(element);
        if (progressBar)
            progressBar.style.width = `${count / max * 100}%`;
    }).then(() => {
        console.log("imager has loaded all.");
        if (progressBar)
            setTimeout(() => { progressBar.style.opacity = `0`; }, 500);
    });
    //
    const scroller = new Scroller();
});
//
//
//
window.addEventListener('DOMContentLoaded', (event) => {
    //console.log('DOMContentLoaded');
});
