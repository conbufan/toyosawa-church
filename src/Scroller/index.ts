/*

scroller

*/


type OnCallBackParams = {
    element: NonNullable<Item["element"]>,
    rect: DOMRect,
    screen: {
        top: number,
        bottom: number,
    },
    diffCenter: number, // 中心位置の差異
}

type EnterCallBackParams = OnCallBackParams;

type OffCallBackParams = {
    element: NonNullable<Item["element"]>,
    rect: DOMRect,
}

type InitCallBackParams = {
    element: NonNullable<Item["element"]>,
    rect: DOMRect,
}

type DefaultCallBackParams = {
    element: NonNullable<Item["element"]>,
    rect: DOMRect,
}

//
//
//
export class Scroller {
    private item$id: {[ elementId: string]: Item };
    //private rootElement: HTMLElement|Window;

    //
    //
    //
    constructor(){
        //this.rootElement = el;
        this.item$id = {};
        // スクロールとりサイズをListen開始
        // this.rootElement.addEventListener( "scroll", this.onScrollResize.bind(this) ,{ passive: true } );
        window.addEventListener( "scroll", this.onScrollResize.bind(this) ,{ passive: true } );
        window.addEventListener( "resize", this.onScrollResize.bind(this) ,{ passive: true } );
        /*
        document.body.onload = ()=>{
            console.log("load!");
            console.log( document.getElementById("circles") )
        };
        */
    }

    //
    // Add Element
    //
    set( elementId: string ){
        const item = new Item(elementId);
        this.item$id[ elementId ] = item;

        this.onScrollResize(); // 1回は回しておく
        return item;
    }

    //
    //
    //
    get( elementId: string ){
        return this.item$id[ elementId ];
    }

    //
    //
    //
    removeListen() {
        //this.rootElement.removeEventListener( "scroll", this.onScrollResize );
        window.removeEventListener( "scroll", this.onScrollResize );
        window.removeEventListener( "resize", this.onScrollResize );
    }

    //
    // 画面と対象要素のあたり判定
    // 画面とDOM要素、それぞれの中心点と半分を取得して重なってるか確認
    //
    onScrollResize(){
        
        requestAnimationFrame( ()=>{
            
            //const target = Object.prototype.toString.call(this.rootElement) == "[object Window]" ? document.documentElement : this.rootElement;
            const target = document.documentElement;

            let top = target.scrollTop;
            let height = window.innerHeight;
            
            // 画面 
            
            const screen = {
                center: top + ( height /2 ),
                half : height /2,
            }
            for ( let item of Object.values(this.item$id) ){
                if ( !item.rect ) continue;
                // dom要素
                const dom = {
                    // item.react.topは画面内表示上の位置になる
                    center: top + item.rect.top + item.rect.height /2,
                    half: item.rect.height /2,
                }
                // 中心位置の差異
                const diffCenter = Math.abs(screen.center - dom.center);
                //console.log( " diffCenter", diffCenter, "screen", screen.center , "dom", dom.center );
                if ( diffCenter <= screen.half + dom.half ){
                    // ヒット
                    item._on({
                            top: top,
                            bottom: top + height,
                        },
                        diffCenter,
                    );
                } else {
                    item._off();
                }
            }
        });
    }
    
};

//
//
//
class Item {
    private elementId: string;
    private isOnScreenIn: boolean;
    private onCallback: (x: OnCallBackParams )=>void;
    private enterCallback: (x: EnterCallBackParams )=>void;
    private offCallback: (x: OffCallBackParams )=>void;
    //private initCallback: (x:{ me: Item })=>void;
    constructor(elementId: string){
        this.elementId = elementId;
        this.onCallback = ()=>{};
        this.offCallback = ()=>{};
        this.isOnScreenIn = false;
        this.enterCallback = ()=>{};
        //this.initCallback = ()=>{};
    }

    //
    //  Element
    //
    get element(){
        const x = document.getElementById( this.elementId );
        if ( !x ) return null;
        x.setAttribute("data-scroller-item-element","true");
        return x;
    }

    //
    //  Rect
    //
    get rect(){
        if ( !this.element ) return null;
        return this.element.getBoundingClientRect();
        
    }

    //
    //  画面に表示された時
    //
    _on( screen: OnCallBackParams["screen"], diffCenter: number ){
        
        if ( this.element === null || this.rect === null ){
            return;
        }

        if ( !this.isOnScreenIn ) {
            this.element.setAttribute("data-scroller-item-enterscreen","true");
            this.enterCallback({
                element: this.element,
                rect: this.rect,
                screen: screen,
                diffCenter,
            })
        }
        this.isOnScreenIn = true;
        
        this.element.setAttribute("data-scroller-item-inscreen","true");
        this.onCallback({
            element: this.element,
            rect: this.rect,
            screen: screen,
            diffCenter,
        })
    }

    //
    // 画面から消えた時
    //
    _off(){
        if ( !this.isOnScreenIn ) return;
        if ( this.element === null || this.rect === null ){
            return;
        }
        this.element.setAttribute("data-scroller-item-inscreen","false");
        this.element.setAttribute("data-scroller-item-enterscreen","false");
        this.isOnScreenIn = false;
        this.offCallback({
            element: this.element,
            rect: this.rect,
        })
    }

    //
    //  画面に表示された時の処理
    //
    public on( callback: (x:OnCallBackParams)=>void ){
        this.onCallback = callback;
        return this;
    };

    public off( callback: (x:OffCallBackParams)=>void ){
        this.offCallback = callback;
        return this;
    };

    //
    // 視界に入った時の処理
    //
    public enter( callback: (x:EnterCallBackParams)=>void ){
        this.enterCallback = callback;
        return this;
    };

    //
    // 最初との処理を設定。
    //
    public onLoad( callback: (x:InitCallBackParams)=>void ){
        if ( this.element === null || this.rect === null ){
            return this;
        }
        this.element.setAttribute("data-scroller-item-onload","true");
        callback({
            element: this.element,
            rect: this.rect,
        });
        return this;
    }

    //
    // 最初と、画面から外れた時の処理を設定。
    //
    public default( callback: (x:DefaultCallBackParams)=>void ){

        this.onLoad(callback);

        if ( this.element === null || this.rect === null ){
            return this;
        }
        this.element.setAttribute("data-scroller-item-default","true");
        this.off( callback );
        return this;
    }
}



