import { Series } from './../../series/Series';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class ColumnSeries extends Series {

    _rectWidthDimensions: number;
    _recrHeightDimensions: number;
    _seriesCnt: number;
    _seriesIndex: number;
    _type: string;
    _stackField: Array<string>;
    _seriesWidth: number;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this._seriesIndex = 0;
        this._seriesCnt = 1;
        this._rectWidthDimensions = 0;
        this._recrHeightDimensions = 0;
    }

    set rectWidthDimensions(value: number) {
        this._rectWidthDimensions = value;
    }

    get rectWidthDimensions(): number {
        return this._rectWidthDimensions;
    }

    set recrHeightDimensions(value: number) {
        this._recrHeightDimensions = value;
    }

    get recrHeightDimensions(): number {
        return this._recrHeightDimensions;
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

    set type(value: string) {
        this._type = value;
    }

    get type(): string {
        return this._type;
    }

    set stackField(value: Array<string>) {
        this._stackField = value;
    }

    get stackField() {
        return this._stackField;
    }

    dataSetting() {
        super.dataSetting();
        for (let j = 0; j < this.dataProvider.length; j++) {
            this.data = this.dataProvider[j];
            console.log(this.data);
            this.index = j;
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        switch (this.type) {
            case 'stacked' :
                this._stacked();
            break;
            case 'group' :
                this._group();
            break;
            default :
                this._normal();
            break;
        }
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
        const thatElement = this.target.datum(this.data)
                                        .append('rect')
                                        .attr('class', this.displayName + this._index)
                                        .attr('value', this._data[this._yField])
                                        .style('fill', this.color);
        super.addEvent(thatElement);
    }

    _normal() {
        if (this.xAxe) {
            this.x = this.xAxe.scale(this._data[this._xField]) + this.seriesIndex * this.rectWidthDimensions;
            this.width = this.xAxe.itemDimensions;
        }
        if (this.yAxe) {
            const min = this.yAxe.scale.domain()[0];
            const max = this.yAxe.scale.domain()[1];
            const targetvalue = this._data[this._yField];
            if (min < 0) {
                if (targetvalue < 0) {
                    this.y = this.yAxe.scale(0);
                    this.height = this.yAxe.scale(targetvalue + max);
                } else {
                    this.y = this.yAxe.scale(targetvalue);
                    const comparevalue = this.yAxe.scale(targetvalue + min);
                    this.height = this.yAxe.scale.range()[0] - comparevalue;
                }
            } else {
                this.y = this.yAxe.scale(targetvalue);
                this.height = this.yAxe.scale.range()[0] - this.y;
            }
        }
    }

    _stacked() {
        if (this.xAxe) {
            this.x = this.xAxe.scale(this._data[this._xField]);
            this.width = this.xAxe.itemDimensions;
        }
        if (this.yAxe) {
            const min = this.yAxe.scale.domain()[0];
            const max = this.yAxe.scale.domain()[1];
            const targetvalue = this._data[this._yField];
            let compareValue = 0;
            let currentField = '';
            if (targetvalue < 0) {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue = this._data[currentField];
                        if (compareTmpValue < 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                if (compareValue !== 0) {
                    this.y = this.yAxe.scale(compareValue);
                } else {
                    this.y = this.yAxe.scale(0);
                }
                this.height = this.yAxe.scale(targetvalue + max);
            } else {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue = this._data[currentField];
                        if (compareTmpValue > 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                this.y = this.yAxe.scale(targetvalue + compareValue);
                const cmp = this.yAxe.scale(targetvalue + min);
                this.height = this.yAxe.scale.range()[0] - cmp;
            }
        }
    }

    _group() {
        if (this.seriesCnt > 1) {// case : multi series
            this.rectWidthDimensions = (this.xAxe.itemDimensions / this.seriesCnt);
        }
        if (this.xAxe) {
            this.x = this.xAxe.scale(this._data[this._xField]) + this.seriesIndex * this.rectWidthDimensions;
            this.width = this.rectWidthDimensions;
        }
        if (this.yAxe) {
            const min = this.yAxe.scale.domain()[0];
            const max = this.yAxe.scale.domain()[1];
            const targetvalue = this._data[this._yField];
            if (min < 0) {
                if (targetvalue < 0) {
                    this.y = this.yAxe.scale(0);
                    this.height = this.yAxe.scale(targetvalue + max);
                } else {
                    this.y = this.yAxe.scale(targetvalue);
                    const comparevalue = this.yAxe.scale(targetvalue + min);
                    this.height = this.yAxe.scale.range()[0] - comparevalue;
                }
            } else {
                this.y = this.yAxe.scale(targetvalue);
                this.height = this.yAxe.scale.range()[0] - this.y;
            }
        }
    }

};
