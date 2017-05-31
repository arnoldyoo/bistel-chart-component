import { AxisConfiguration, AxisConditions } from './../../model/chart-param.interface';
import { Axe } from './axe';
import { IDisplay } from './../i-display.interface';

export abstract class Axis implements IDisplay {
    axe: Axe;

    _configuration: AxisConfiguration;
    _field: string;
    _format: any;
    _visible: boolean;
    _gridline: boolean;
    _title: string;
    _domain: Array<any>;
    _type: string;
    _orient: string;
    _margin: any;
    _target: any;  // svg group element value
    _width: number;
    _height: number;
    _tickInfo: any;
    _dataProvider: Array<any>;
    _range: Array<number>;
    _scale: any;

    _isStacked: boolean;

    numeric_min: number;
    numeric_max: number;

    // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any
    constructor(axisconfig?: AxisConfiguration) {
        if (axisconfig) {
            this.configuration = axisconfig;
        }
    }

    set configuration( value: AxisConfiguration ) {
        this._configuration = value;
        if (this._configuration) {
            this.width = this._configuration.width;
            this.height = this._configuration.height;
            this.margin = this._configuration.margin;
            this.domain = this._configuration.domain;
            this.isStacked = this._configuration.isStacked;
            if (this._configuration.conditions) {
                this._setConditions(this._configuration.conditions);
            }
            this.dataProvider = this._configuration.data;
            if (this._configuration.target) {
                this.target = this._configuration.target;
            }
        }
    }

    get configuration() {
        return this._configuration;
    }

    set target( value: any ) {
        this._createContainer(value);
    }

    get target(): any {
        return this._target;
    }

    set width(value: number) {
        this._width = value;
    }

    get width() {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    set field( value: string ) {
        this._field = value;
    }

    get field() {
        return this._field;
    }

    set format( value: any ) {
        this._format = value;
    }

    get format() {
        return this._format;
    }

    set gridline( value: boolean ) {
        this._gridline = value;
    }

    get gridline() {
        return this._gridline;
    }

    set visible( value: boolean ) {
        this._visible = value;
    }

    get visible() {
        return this._visible;
    }

    set title( value: string ) {
        this._title = value;
    }

    get title() {
        return this._title;
    }

    set domain( value: any ) {
        this._domain = value;
    }
    get domain() {
        return this._domain;
    }

    set type( value: string ) {
        this._type = value;
    }

    get type() {
        return this._type;
    }

    set orient( value: string ) {
        this._orient = value;
    }

    get orient() {
        return this._orient;
    }

    set margin( value: any ) {
        this._margin = value;
    }

    get margin() {
        return this._margin;
    }

    set tickInfo( value: any ) {
        this._tickInfo = value;
    }

    get tickInfo() {
        return this._tickInfo;
    }

    set dataProvider( value: Array<any> ) {
        this._dataProvider = value;
        if ( !this.domain ) {
            this._createDefaultDomain();
        }
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set isStacked(value: boolean) {
        this._isStacked = value;
    }

    get isStacked() {
        return this._isStacked;
    }

    protected _setupAxe() {
        this.scaleSetting();
        this.scaleToAxeSetting();
    }

    _setConditions(conditions: AxisConditions) {
        this.field = conditions.field;
        this.format = conditions.format;
        this.visible = conditions.visible;
        this.title = conditions.title;
        this.type = conditions.type;
        this.orient = conditions.orient;
        this.gridline = conditions.gridline;
        if (conditions.tickInfo) {
            this.tickInfo = conditions.tickInfo;
        }
    }

    _createContainer(axisTarget: any) {
        this._target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
        this.updateDisplay(this.width, this.height);
    }

    protected _updateContainerPosition(svgtarget) {
        let px = 0;
        let py = 0;
        switch (this.orient) {
            case 'bottom' :
                px = this.margin.left;
                py = this.height + this.margin.top;
            break;
            case 'top' :
                px = this.margin.left;
                py = this.margin.top;
            break;
            case 'right' :
                px = this.margin.left + this.width;
                py = this.margin.top;
            break;
            case 'left' :
                px = this.margin.left;
                py = this.margin.top;
            break;
            default :
                px = this.margin.left;
                py = this.margin.top;
            break;
        }
        svgtarget.attr('transform', `translate(${px}, ${py})`);
    }

    protected _createDefaultDomain() {
        const targetArray: Array<any> = this.field.split(',');
        const targetField: string = targetArray[0];
        this.domain = this.dataProvider.map( d => {
            return d[targetField];
        });
        if ( this.domain.length && _.isNumber(this.domain[0]) ) {
            const tempDomain = [...this.domain];
            this.domain = [];
            let min: number = _.min(tempDomain);
            // date type length 13
            if (min > 0 && min.toString().length !== 13) {
                min = 0;
            }
            let max: number = _.max(tempDomain);
            max = max + (max * 0.1);
            this.domain.push(min);
            this.domain.push(max);
        }
    }

    _drawGridLine() {
        if (this._target) {
            const rootSvg: any = d3.select(this.target[0][0].nearestViewportElement);
            const gridGroup = rootSvg.select(`.grid-line-${this.type}-${this.orient}`);
            if (!gridGroup[0][0]) {
                console.log('create grid group ');
                rootSvg.insert('g', '.background')
                        .attr('class', `grid-line-${this.type}-${this.orient}`)
                        .style('stroke', '#CCC');
            }
            if (this.gridline && this.axe.scaleToAxe) {
                let px = 0;
                let py = 0;
                switch (this.orient) {
                    case 'bottom' :
                        px = this.margin.left;
                        py = this.height + this.margin.top;
                    break;
                    case 'top' :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                    case 'right' :
                        px = this.margin.left + this.width;
                        py = this.margin.top;
                    break;
                    case 'left' :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                    default :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                }
                // this._updateContainerPosition(gridGroup);
                gridGroup.attr('transform', `translate(${px}, ${py})`);
                const gridScale = d3.svg.axis()
                                    .scale(this._scale)
                                    .orient(this.orient);
                if (this.type === 'y') {
                    gridScale.tickSize(-(this.width), 0, 0)
                             .tickFormat('');
                } else {
                    gridScale.innerTickSize(-(this.height))
                             .outerTickSize(0)
                             .tickFormat('');
                }
                gridGroup.call(gridScale);
            }
        }
    }

    updateDisplay(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._setupAxe();
        this._drawGridLine();
        this._updateContainerPosition(this.target);
        this.makeAxisLabel();
    }

    protected scaleToAxeSetting() { }

    protected scaleSetting() {
        this._range = [];
        if (this.type === 'x') {
            this._range.push(0);
            this._range.push(this.width);
        } else {
            this._range.push(this.height);
            this._range.push(0);
        }
    }

    protected makeAxisLabel() { }
}
