import { IDisplay } from './iDisplay.interface';

export class ChartBase implements IDisplay {

    configuration: any;
    target: any;

    constructor(config: any) {
        this.configuration = config;
    }

    // IDisplay interface getter setter
    set width(width: number) {
        this.width = width;
    }
    get width() {
        return this.width;
    }

    set height(height: number) {
        this.height = height;
    }
    get height() {
        return this.height;
    }

    // getter setter methods
    set dataProvider(data: any[]) {

    };
    get dataProvider(){
        return;
    };

    set axis(axis: any[]) {

    };
    get axis() {
        return;
    };

    set series(series: any[]){

    };
    get series() {
        return;
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
