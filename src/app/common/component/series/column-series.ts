import { Series } from './../../series/Series';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class ColumnSeries extends Series {

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
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
        this.x = this.xAxe.scale(this._data[this._xField]);
        this.width = this.xAxe.itemDimensions;

        this.y = this.yAxe.scale(this._data[this._yField]);
        this.height = this.yAxe.scale.range()[0] - this.y;
    }

    updateDisplay() {
        super.updateDisplay();
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
                            .attr('class', this.displayName + this._index);
    }

};
