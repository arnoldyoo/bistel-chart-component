import { Series } from 'app/common/series/Series';
import { SeriesParam } from 'app/model/ChartParam.interface';

export class LineSeries extends Series {

    line: any;

    constructor( seriesParam: SeriesParam ) {
        super( seriesParam );
    }

    dataSetting(): void {
        super.dataSetting();
        if (this.dataProvider) {
            this.updateDisplay();
        }
    }

    generatePosition(): void {
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        this.line = d3.svg.line()
            .x((d) => {
                return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this._xField]);
            })
            .y((d) => {
                return this.yAxe.scale(d[this._yField]);
            })
            .interpolate('interpolate');
    }

    updateDisplay(): void {
        this.generatePosition();
        const svgElement: any = this._seriesTarget.select(`.${this.displayName + this._index}`);
        if (!svgElement[0][0]) {
            this.createItem();
        } else {
            svgElement.datum(this.dataProvider);
        }
        svgElement.attr('d', this.line);
    }

    createItem(): void {
        this._seriesTarget.datum(this.data)
                            .append('path')
                            .attr('class', this.displayName + this._index);
    }

};