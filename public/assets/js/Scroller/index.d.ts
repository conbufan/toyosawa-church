type OnCallBackParams = {
    element: NonNullable<Item["element"]>;
    rect: DOMRect;
    screen: {
        top: number;
        bottom: number;
    };
    diffCenter: number;
};
type EnterCallBackParams = OnCallBackParams;
type OffCallBackParams = {
    element: NonNullable<Item["element"]>;
    rect: DOMRect;
};
type InitCallBackParams = {
    element: NonNullable<Item["element"]>;
    rect: DOMRect;
};
type DefaultCallBackParams = {
    element: NonNullable<Item["element"]>;
    rect: DOMRect;
};
export declare class Scroller {
    private item$id;
    constructor();
    set(elementId: string): Item;
    get(elementId: string): Item;
    removeListen(): void;
    onScrollResize(): void;
}
declare class Item {
    private elementId;
    private isOnScreenIn;
    private onCallback;
    private enterCallback;
    private offCallback;
    constructor(elementId: string);
    get element(): HTMLElement | null;
    get rect(): DOMRect | null;
    _on(screen: OnCallBackParams["screen"], diffCenter: number): void;
    _off(): void;
    on(callback: (x: OnCallBackParams) => void): this;
    off(callback: (x: OffCallBackParams) => void): this;
    enter(callback: (x: EnterCallBackParams) => void): this;
    onLoad(callback: (x: InitCallBackParams) => void): this;
    default(callback: (x: DefaultCallBackParams) => void): this;
}
export {};
