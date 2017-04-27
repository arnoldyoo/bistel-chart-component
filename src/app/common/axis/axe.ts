export class Axe {
    _scaleToAxe: any; // chart base reference, scale 적용된 axe
    _scale: any;
    _axeType: string; // x or y
    _width: number;
    _height: number;
    _dataType: string;
    _domain: Array<any>;
    _orient: string;

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

    set axeType( value: string ) {
        this._axeType = value;
    }
    get axeType() {
        return this._axeType;
    }

    set width( value: number ) {
        this._width = value;
    }
    get width() {
        return this._width;
    }

    set domain( value: Array<any> ) {
        this._domain = value;
    }
    get domain() {
        return this._domain;
    }

    set height( value: number ) {
        this._height = value;
    }
    get height() {
        return this._height;
    }

    set orient( value: string ) {
        this._orient = value;
    }
    get orient() {
        return this._orient;
    }

    set dataType( value: string ) {
        this._dataType = value;
    }
    get dataType() {
        return this._dataType;
    }

    constructor( axe: string, width: number, height: number, dataType: string, domain: Array<any>, orient: string ) {
        this._axeConfigSetting(axe, width, height, dataType, domain, orient);
        this._scaleSetting();
        this.scaleToAxeSetting();
        // d3 scale 설정
        // category, numeric, date
    }
    _axeConfigSetting(axe: string, width: number, height: number, dataType: string, domain: Array<any>, orient: string ): void {
        this.axeType = axe;
        this.width = width;
        this.height = height;
        this.dataType = dataType;
        this.domain = domain;
        this.orient = orient;
    }
    _scaleSetting(): void {
        if ( this.dataType === 'ordinal' ) {
            this.scale = d3.scale.ordinal()
                                    .domain(this.domain)
                                    .rangeRoundBands( [0, this.width], .1 );
        } else if ( this.dataType === 'numeric') {
            this.scale = d3.scale.linear()
                                    .domain(this.domain)
                                    .range([this.height, 0]);
        } else {
            this.scale = d3.time.scale()
                                    .domain(this.domain)
                                    .range([0, this.width]);
        }
    }
    scaleToAxeSetting(): void {
        this.scaleToAxe = d3.svg.axis()
                                .scale(this.scale)
                                .orient(this.orient);
    }
}
