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
            for (let i = 0; i < targetArray.length; i++) {
                const maxTmp: any = _.maxBy(this.dataProvider, targetArray[i]);
                const minTmp: any = _.minBy(this.dataProvider, targetArray[i]);
                const obj: any = {
                  field: targetArray[i],
                  minValue: minTmp[targetArray[i]],
                  maxValue: maxTmp[targetArray[i]]
                };
                tempArray.push(obj);
            }
            const max: any = _.maxBy(tempArray, 'maxValue');
            const min: any = _.minBy(tempArray, 'minValue');

            this.domain = [];
            this.domain.push(min.minValue);
            this.domain.push(max.maxValue + (max.maxValue * 0.1));
        } else {
            super._createDefaultDomain();
        }
    }
}
