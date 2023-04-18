export declare class Imager {
    constructor();
    array(): HTMLImageElement[];
    static init(element: HTMLImageElement): void;
    loadedAll(onComplete: (element: HTMLImageElement, count: number, max: number) => void): Promise<any[]>;
}
