import { IDisplay } from './iDisplay.interface';

export class ChartBase implements IDisplay {

    configuration: any;
    target: any; //target svg element

    _width: number;
    _height: number;
    // axis 는 orient string type으로 key :value로 저장한다.
    // 예 : 'top': xaxis, 'left': yaxis
    // 가져올 때 : return _axis['left']
    _axis: any[] = [];
    _series: any[] = [];

   constructor( config: any ) {
        this.configuration = config;
    }

   // IDisplay interface getter setter
    set width( value: number ) {
        this._width = value;
    }
    get width(): number {
        return this._width;
    }

    set height( value: number ) {
        this._height = value;
    }
    get height() {
        return this._height;
    }

   // getter setter methods
    set dataProvider( data: any[] ) {

   };
    get dataProvider() {
        return <any>[];
    };

   set axis( value: any[] ) {
        this._axis = value;
    };
    get axis(): any[] {
        return this._axis;
    };

   set series( value: any[] ) {
        this._series = value;
    };
    get series(): any[] {
        return this._series;
    };

    // generate svg element using configuration
    generateConfiguration(): void {
        this.target = this._createSvg(this.configuration.chart);

        // generate axis component using this.target

        // generate series component using this.target

    };

    // iDisplay interface method
    updateDisplay(width: number, height: number): void {
        this.target
            .style('width', width + 'px')
            .style('height', height + 'px');
    };

    _addEvent(): void { };

    _createSvg(chartConfig: any): void {
        return d3.select(chartConfig.selector).append('svg');
    }

};
