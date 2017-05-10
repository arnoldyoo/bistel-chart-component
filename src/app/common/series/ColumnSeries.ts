import { Series } from "app/common/series/Series";
import { SeriesParam } from "app/model/ChartParam.interface";

export class ColumnSeries extends Series {

    constructor( seriesParam:SeriesParam ) {
        super( seriesParam );
    }

    generatePosition(): void{
        super.generatePosition();
        //set x, y
        //set width, height
    }

    updateDisplay( width: number, height: number ): void {
        super.updateDisplay( width, height );
    }

}