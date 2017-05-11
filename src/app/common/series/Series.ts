import { IDisplay } from './../iDisplay.interface';
import { SeriesParam } from "app/model/ChartParam.interface";
import { Axe } from "app/common/axis/axe";

export class Series implements IDisplay {

    width: number;
    height: number;
    target: any;//chart-base 에서 group element를 넘겨받음.

    //api private
    _displayName: string = '';//한글 사용 금지. why? element의 class 명으로 사용.
    _xField: string;
    _yField: string;

    //private
    _seriesTarget: any;
    _data: any;
    _index: number;
    _xAxe: Axe;
    _yAxe: Axe;
    _x: any;
    _y: any;

    constructor( seriesParam:SeriesParam ) {
        this.target = seriesParam.target;
        this._xField = seriesParam.config.xField;
        this._yField = seriesParam.config.yField;
        this.displayName = seriesParam.config.displayName;
        //displayName 이 없을 시 필드명으로 setup.
        if ( seriesParam.config.displayName ) {
            this.displayName = seriesParam.config.displayName;
        } else {
            this.displayName = this._xField;
        }
        //series 별로 group <g> element를 생성한다.
        this._createContainer();
    }

    set displayName( value: string ) {
        this._displayName = value;
        if ( !this._displayName ) {
            this._displayName = this._xField;
        }
    }

    get displayName(): string {
        return this._displayName;
    }

    set xField( value: string ) {
        this._xField = value;
    }

    get xField(): string {
        return this._xField;
    }

    set yField( value: string ) {
        this._yField = value;
    }

    get yField(): string {
        return this._yField;
    }

    set data( value: any ) {
        this._data = value;
        //data가 들어오면 Axe의 scale 정보와 축 정보를 가져와서 그려진 좌표와 series 크기를 설정한다.
        if ( this._data ) {
            this.generatePosition();
            this.updateDisplay( this.width, this.height );
        }
    }

    get data(): any {
        return this._data;
    }

    set index( value: number ) {
        this._index = value;
    }

    get index(): number {
        return this._index;
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

    set x( value: any ) {
        this._x = value;
    }

    get x(): any {
        return this._x;
    }

    set y( value: any ) {
        this._x = value;
    }

    get y(): any {
        return this._x;
    }


    createChildren(): void {

    }

    updateDisplay( width, height ): void {
        
    }

    generatePosition(): void {
        //set x, y
        //set width, height
    }

    _createContainer(): void {
        this._seriesTarget = this.target.append('g').attr('class', `.${this.displayName}`);
    }

}