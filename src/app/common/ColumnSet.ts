import { ColumnSeries } from "app/common/series/ColumnSeries";

export class ColumnSet {

    _series: Array<ColumnSeries>;
    _type: string;

    constructor() {
        this._type = 'group';
    }

    set series(value: Array<ColumnSeries>) {
        this._series = value;
    }
    get series(): Array<ColumnSeries> {
        return this._series;
    }

    set type(value: string) {
        this._type = value;
    }
    get type(): string {
        return this._type;
    }
}