import { Axe } from './../../axis/axe';
import { AxisConfiguration } from './../../../model/chart-param.interface';
import { Axis } from '../../axis/axis';

export class NumericAxis extends Axis {

    _zero: any;

    constructor(axisconfig: AxisConfiguration) {
        super(axisconfig);
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel() {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }

    scaleSetting() {
        super.scaleSetting();
        this.numeric_min = this.domain[0];
        this.numeric_max = this.domain[1];
        this._scale = d3.scale.linear()
                                .domain(this.domain)
                                .range(this._range);
    }

    scaleToAxeSetting() {
        super.scaleToAxeSetting();
        if (!this.axe) {
            this.axe = new Axe();
        }
        this.axe.scale = this._scale;
        this.axe.scaleToAxe = d3.svg.axis()
                                .scale(this._scale)
                                .orient(this.orient);
        if (this.tickInfo.ticks) {
            this.axe.scaleToAxe.ticks(this.tickInfo.ticks);
        }
        if ( this.tickInfo.tickFormat ) {
            this.axe.scaleToAxe.tickFormat(this.tickInfo.tickFormat);
        }
    }

    _createDefaultDomain() {
        const targetArray: Array<any> = this.field.split(',');
        if (targetArray.length > 1) {
            const tempArray: Array<any> = [];
            let min = 0;
            let max = 0;
            let maxTmp = 0;
            let minTmp = 0;
            let currentField = '';
            this.domain = [];
            if (this.isStacked) {
                for (let i = 0; i < this.dataProvider.length; i++) {
                    const currentObj = this.dataProvider[i];
                    maxTmp = 0;
                    minTmp = 0;
                    for (let j = 0; j < targetArray.length; j++) {
                        currentField = targetArray[j];
                        maxTmp += currentObj[currentField];
                        if (currentObj[currentField] < 0) {
                            minTmp += currentObj[currentField];
                        }
                    }
                    if (max < maxTmp) {
                        max = maxTmp;
                    }
                    if (min > minTmp) {
                        min = minTmp;
                    }
                }
                this.domain.push(min);
                this.domain.push(max + (max * 0.1));
            } else {
                for (let i = 0; i < targetArray.length; i++) {
                    maxTmp = _.maxBy(this.dataProvider, targetArray[i]);
                    minTmp = _.minBy(this.dataProvider, targetArray[i]);
                    const obj: any = {
                        field: targetArray[i],
                        minValue: minTmp[targetArray[i]],
                        maxValue: maxTmp[targetArray[i]]
                    };
                    tempArray.push(obj);
                }
                max = _.maxBy(tempArray, 'maxValue').maxValue;
                min = _.minBy(tempArray, 'minValue').minValue;
                this.domain.push(min);
                this.domain.push(max + (max * 0.1));
            }
        } else {
            super._createDefaultDomain();
        }
    }

    _updateContainerPosition() {
        super._updateContainerPosition(this.target);
        if (this.numeric_min && this.numeric_max && this.numeric_min < 0) {
            this._showZeroLine();
        };
    }

    _showZeroLine() {
        if (!this._zero) {
            const rootSvg: any = d3.select(this.target[0][0].nearestViewportElement);
            this._zero = rootSvg.append('g').attr('class', 'zero');
            this._zero.append('line');
        }
        this._zero.attr('transform', `translate(${this.margin.left}, ${this._getNumericScale() + this.margin.top})`);
        const median = this._zero.select('line');
        if (this.type === 'y') {
            this._zero.attr('transform', `translate(${this.margin.left}, ${this._getNumericScale() + this.margin.top})`);
            median.attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', this.width)
                .attr('y2', 0)
                .attr('stroke-width', 1)
                .attr('stroke', 'black');
        } else {
            this._zero.attr('transform', `translate(${this._getNumericScale() + this.margin.left}, ${this.margin.top})`);
            median.attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', this.height)
                .attr('stroke-width', 1)
                .attr('stroke', 'black');
        }
    }

    _getNumericScale(): any {
        const temp_range: Array<number> = [];
        if (this.type === 'x') {
            temp_range.push(0);
            temp_range.push(this.width);
        } else {
            temp_range.push(this.height);
            temp_range.push(0);
        }
        const temp_scale: any = d3.scale.linear()
                            .domain([this.numeric_min, this.numeric_max])
                            .range(temp_range);

        const scaley: number = temp_scale(0);
        return scaley;
    }
}
