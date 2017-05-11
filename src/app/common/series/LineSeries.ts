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
                // console.log(d);
                console.log(this.xAxe.scale(d[this._xField]));
                return this.xAxe.scale.rangeBand() / 2 + this.xAxe.scale(d[this._xField]);
            })
            .y((d) => {
                // console.log(d);
                console.log(this.yAxe.scale(d[this._yField]));
                return this.yAxe.scale(d[this._yField]);
            })
            .interpolate('interpolate');
    }

    updateDisplay(): void {
        this.generatePosition();
        const rectElement: any = this._seriesTarget.select(`.${this.displayName + this._index}`);
        if (!rectElement[0][0]) {
            this.createItem();
        } else {
            rectElement.datum(this.dataProvider);
        }
        rectElement.attr('d', this.line);
    }

    createItem(): void {
        this._seriesTarget.datum(this.data).append('path')
                                           .attr('class', this.displayName + this._index);
    }

};
