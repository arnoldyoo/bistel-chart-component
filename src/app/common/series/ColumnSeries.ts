import { Series } from "app/common/series/Series";
import { SeriesParam } from "app/model/ChartParam.interface";

export class ColumnSeries extends Series {

    constructor( seriesParam: SeriesParam ) {
        super( seriesParam );
    }

    generatePosition(): void{
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        this.x = this.xAxe.scale(this._data[this._xField]);
        this.width = this.xAxe.scale.rangeBand();

        this.y = this.yAxe.scale(this._data[this._yField]);
        this.height = this.yAxe.scale.range()[0] - this.y;
        console.log('range : ', this.yAxe.scale.range());
        console.log(`ColumnSeries.generatePosition() => ${this.x}, ${this.y} | ${this.width}, ${this.height}`);
    }

    updateDisplay( width: number, height: number ): void {
        super.updateDisplay( width, height );
    }

}