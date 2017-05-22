import { Axe } from './../../axis/axe';
import { AxisConfiguration } from './../../../model/chart-param.interface';
import { Axis } from '../../axis/axis';

export class NumericAxis extends Axis {

    _scale: any;

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
            let currentFiled = '';
            this.domain = [];
            if (this.isStacked) {
                for (let i = 0; i < this.dataProvider.length; i++) {
                    const currentObj = this.dataProvider[i];
                    maxTmp = 0;
                    minTmp = 0;
                    for (let j = 0; j < targetArray.length; j++) {
                        currentFiled = targetArray[j];
                        maxTmp += currentObj[currentFiled];
                        if (currentObj[currentFiled] < 0) {
                            minTmp -= currentObj[currentFiled];
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
}
