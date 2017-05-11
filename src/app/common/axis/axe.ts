export class Axe {

    _scaleToAxe: any; // chart base reference, Axis with scale value
    _scale: any;
    name: string;

    // getter setter method
    set scaleToAxe( value: any ) {
        this._scaleToAxe = value;
    }
    get scaleToAxe() {
        return this._scaleToAxe;
    }

    set scale( value: any ) {
        this._scale = value;
    }
    get scale() {
        return this._scale;
    }

    constructor( ) { }
}
