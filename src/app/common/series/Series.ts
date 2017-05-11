import { IDisplay } from './../iDisplay.interface';
import { SeriesParam } from "app/model/ChartParam.interface";
import { Axe } from "app/common/axis/axe";

export class Series implements IDisplay {

    _width: number;
    _height: number;
    _target: any;//chart-base 에서 group element를 넘겨받음.

    //api private
    _displayName: string = '';//한글 사용 금지. why? element의 class 명으로 사용.
    _xField: string;
    _yField: string;

    //private
    _seriesTarget: any;
    _data: any;
    _dataProvider: Array<any>;
    _index: number;
    _xAxe: Axe;
    _yAxe: Axe;
    _x: any;
    _y: any;

    constructor(seriesParam:SeriesParam) {
        this.target = seriesParam.target;
        this._xField = seriesParam.config.xField;
        this._yField = seriesParam.config.yField;
        this.displayName = seriesParam.config.displayName;
        // tslint:disable-next-line:comment-format
        // displayName 이 없을 시 필드명으로 setup.
        if (seriesParam.config.displayName) {
            this.displayName = seriesParam.config.displayName;
        } else {
            this.displayName = this._xField;
        }
        // tslint:disable-next-line:comment-format
        // series 별로 group <g> element를 생성한다.
        this._createContainer();
    }

    set width(value: number) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height(): number {
        return this._height;
    }

    set target(value: any) {
        this._target = value;
    }

    get target(): any {
        return this._target;
    }

    set displayName(value: string) {
        this._displayName = value;
        if (!this._displayName) {
            this._displayName = this._xField;
        }
    }

    get displayName(): string {
        return this._displayName;
    }

    set xField(value: string) {
        this._xField = value;
    }

    get xField(): string {
        return this._xField;
    }

    set yField(value: string) {
        this._yField = value;
    }

    get yField(): string {
        return this._yField;
    }

    set data(value: any) {
        this._data = value;
        // tslint:disable-next-line:comment-format
        // data가 들어오면 Axe의 scale 정보와 축 정보를 가져와서 그려진 좌표와 series 크기를 설정한다.
    }

    get data(): any {
        return this._data;
    }

    set index(value: number) {
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

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
        this.dataSetting();
    };
    get dataProvider() {
        return this._dataProvider;
    };

    dataSetting(): void { }

    createChildren(): void { }

    updateDisplay(width?: number, height?: number): void {
        if (this.data) {
            this.generatePosition();
        }
    }

    generatePosition(): void { }

    /*
    * title : createItem
    * description : series data가 0인 point item을 생성한다.
    */
    createItem(): void {}

    /*
    * title : _createContainer
    * description : series class에서 단 한번 group element를 생성한다.
    */
    _createContainer(): void {
        if (!this._seriesTarget) {
            this._seriesTarget = this.target.append('g').attr('class', this.displayName);
        }
    }

}