export class Axe {
    scaleToAxe: any; // chart base reference, scale 적용된 axe
    axeType: string; // x or y config.axe value
    width: number;
    height: number;

    constructor( axe: string, width: number, height: number ) {
        this.axeType = axe;
        this.width = width;
        this.height = height;
        // d3 scale 설정
        // category, numeric, date
    }
}
