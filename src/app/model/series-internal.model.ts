import { Axe } from 'app/common/axis/axe';

export class SeriesInternalModel {

    _seriesTarget: any;
    _xAxe: Axe;
    _yAxe: Axe;
    _x: any;
    _y: any;

    constructor() {
    }

    set seriesTarget(value: any) {
        this._seriesTarget = value;
    }

    get seriesTarget(): any {
        return this._seriesTarget;
    }

    set xAxe( value: Axe ) {
        this._xAxe = value;
    }

    get xAxe(): Axe {
        return this._xAxe;
    }

    set yAxe( value: Axe ) {
        this._yAxe = value;
    }

    get yAxe(): Axe {
        return this._yAxe;
    }

    set x(value: any) {
        this._x = value;
    }

    get x(): any {
        return this._x;
    }

    set y(value: any) {
        this._y = value;
    }

    get y(): any {
        return this._y;
    }
}