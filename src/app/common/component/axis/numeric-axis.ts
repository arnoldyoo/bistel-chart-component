import { Axe } from './../../axis/axe';
import { AxisParam } from './../../../model/chart-param.interface';
import { Axis } from '../../axis/axis';

export class NumericAxis extends Axis {
    _scale: any;

    constructor(axisparams: AxisParam) {
        super(axisparams);
        // make Axis
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
                                .range([this.height, 0]);
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
}
