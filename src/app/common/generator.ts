
export class Generator {
    constructor() { }
    createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg');
    }
    createAxis(axisConfig: any): any {
        return;
    }
    createSeries(seriesConfig: any): any {
        return;
    }
};
