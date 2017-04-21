import { IDisplay } from './iDisplay.interface';

export class ChartBase implements IDisplay {
    width: number;
    height: number;
    spinner: any;
    configuration: any;
    target: any;

    constructor(config: any) {
        this.configuration = config;
    }

    // getter setter methods
    set dataProvider(data: any) {

    };
    get dataProvider(): any{
        return;
    };
    set axis(axis: any) {

    };
    get axis(): any {
        return;
    };
    set series(series: any){

    };
    get series(): any {
        return;
    };

    // generate svg element using configuration
    generateConfiguration(): void {
        this.target = this._createSvg(this.configuration.chart);
    };

    // iDisplay interface method
    updateDisplay(width: number, height: number): void {
        this.target
            .style('width', width + 'px')
            .style('height', height + 'px');
    };

    _addEvent(): void {

    };

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg');
    };

};
