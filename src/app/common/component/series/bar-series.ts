import { Series } from './../../series/Series';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class BarSeries extends Series {

    _rectWidthDimensions: number;
    _rectHeightDimensions: number;
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
        this._rectHeightDimensions = 0;
    }

    set rectWidthDimensions(value: number) {
        this._rectWidthDimensions = value;
    }

    get rectWidthDimensions(): number {
        return this._rectWidthDimensions;
    }

    set rectHeightDimensions(value: number) {
        this._rectHeightDimensions = value;
    }

    get rectHeightDimensions(): number {
        return this._rectHeightDimensions;
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
        this.target.datum(this.data)
                            .append('rect')
                            .attr('class', this.displayName + this._index)
                            .attr('value', this._data[this._xField])
                            .style('fill', this.color);
    }

    _normal() {
        if (this.xAxe) {
            const min = this.xAxe.scale.domain()[0];
            const max = this.xAxe.scale.domain()[1];
            const targetvalue = this.data[this.xField];
            if (min < 0) {
                if (targetvalue < 0) {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                    this.width = this.xAxe.scale(0) - this.xAxe.scale(targetvalue);
                } else {
                    this.x = this.xAxe.scale(0);
                    this.width = this.xAxe.scale(targetvalue + min);
                }

            } else {
                this.x = 0;
                this.width = this.xAxe.scale(this.data[this.xField]);
            }
        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]);
            this.height = this.yAxe.scale.rangeBand();
        }
    }

    _stacked() {
        if (this.xAxe) {
            const min: number = this.xAxe.scale.domain()[0];
            const max: number = this.xAxe.scale.domain()[1];
            const targetvalue = this.data[this.xField];
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
                if ( compareValue !== 0) {
                    this.x = this.xAxe.scale(this.data[this.xField] + compareValue);
                } else {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                }
                this.width = this.xAxe.scale(0) - this.xAxe.scale(targetvalue);
            } else {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue = this._data[currentField];
                        if ( compareTmpValue > 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                this.x = this.xAxe.scale.range()[0] + this.xAxe.scale(compareValue);
                this.width = this.xAxe.scale(targetvalue + min);
            }

        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]);
            this.height = this.yAxe.scale.rangeBand();
        }
    }

    _group() {
        if (this.seriesCnt > 1) {// case : multi series
            this.rectHeightDimensions = (this.yAxe.itemDimensions / this.seriesCnt);
        }
        if (this.xAxe) {
            const min = this.xAxe.scale.domain()[0];
            const max = this.xAxe.scale.domain()[1];
            const targetvalue = this.data[this.xField];
            if (min < 0) {
                if (targetvalue < 0) {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                    this.width = this.xAxe.scale(0) - this.xAxe.scale(targetvalue);
                } else {
                    this.x = this.xAxe.scale(0);
                    this.width = this.xAxe.scale(targetvalue + min);
                }
            } else {
                this.x = 0;
                this.width = this.xAxe.scale(this.data[this.xField]);
            }
        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]) + this.seriesIndex * this.rectHeightDimensions;
            this.height = this.rectHeightDimensions;
        }
    }

};
