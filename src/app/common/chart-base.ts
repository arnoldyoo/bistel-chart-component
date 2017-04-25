import { IDisplay } from './iDisplay.interface';
import { Generator } from './generator';

export class ChartBase implements IDisplay {

    configuration: any;
    target: any;
    _generator: Generator;

    constructor(config: any) {
        this.configuration = config;
        this._generator = new Generator();
    }

    // IDisplay interface getter setter
    set width(width: number) {

    }
    get width() {
        return;
    }

    set height(height: number) {

    }
    get height() {
        return;
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
        this.target = this._generator.createSvg(this.configuration.chart);

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

};
