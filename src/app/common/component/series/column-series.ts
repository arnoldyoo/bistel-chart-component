import { Series } from './../../series/Series';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class ColumnSeries extends Series {

    _rectWidthDimensions: number;
    _seriesCnt: number;
    _seriesIndex: number;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this._seriesCnt = 1;
        this._rectWidthDimensions = 0;
    }

    set rectWidthDimensions(value: number) {
        this._rectWidthDimensions = value;
    }

    get rectWidthDimensions(): number {
        return this._rectWidthDimensions;
    }

    set seriesCnt(value: number) {
        this._seriesCnt = value;
    }

    get seriesCnt(): number {
        return this._seriesCnt;
    }

    set seriesIndex(value: number) {
        this._seriesIndex = value;
    }

    get seriesIndex(): number {
        return this._seriesIndex;
    }

    dataSetting() {
        super.dataSetting();
        for (let j = 0; j < this.dataProvider.length; j++) {
            this.data = this.dataProvider[j];
            this.index = j;
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        if (this.seriesCnt > 1) {
            this.rectWidthDimensions = this.xAxe.itemDimensions / this.seriesCnt;
        }
        console.log(`column series : ${this.index} ${this.rectWidthDimensions}`);
        if (this.xAxe) {
            this.x = this.xAxe.scale(this._data[this._xField]) + this.seriesIndex * this.rectWidthDimensions;
            this.width = this.xAxe.itemDimensions / this.seriesCnt;
        }

        if (this.yAxe) {
            this.y = this.yAxe.scale(this._data[this._yField]);
            this.height = this.yAxe.scale.range()[0] - this.y;
        }
    }

    updateDisplay() {
        super.updateDisplay();
        console.log(`column series ===> updateDisplay( index : ${this.displayName} ${this._index})`);
        const rectElement: any = this.target.select(`.${this.displayName + this._index}`);
        if (!rectElement[0][0]) {
            this.createItem();
        } else {
            rectElement.datum(this.data);
        }
        rectElement.attr('x', this.x)
                   .attr('y', this.y)
                   .attr('width', this.width)
                   .attr('height', this.height);
    }

    createItem() {
        this.target.datum(this.data)
                            .append('rect')
                            .attr('class', this.displayName + this._index)
                            .style('fill', this.color);
    }

};
