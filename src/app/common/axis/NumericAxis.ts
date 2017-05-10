import { AxisParam } from './../../model/ChartParam.interface';
import { Axe } from './axe';
import { Axis } from './axis';
export class NumericAxis extends Axis {
    _scale: any;
    constructor(axisparams: AxisParam) {
        super(axisparams);
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        super.updateDisplay(width, height);
    }
    // 재정의
    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }

    scaleSetting(): void {
        super.scaleSetting();
        this._scale = d3.scale.linear()
                                .domain(this.domain)
                                .range([this.height, 0]);
    }
    scaleToAxeSetting(): void {
        super.scaleToAxeSetting();
        this.axe = new Axe();
        this.axe.scale = this._scale;
        this.axe.scaleToAxe = d3.svg.axis()
                                .scale(this._scale)
                                .orient(this.orient);
        if (this.tickInfo.ticks) {
            this.axe.scaleToAxe.ticks(this.tickInfo.ticks);
        }
        if ( this.tickInfo.tickFormat ) {
            this.axe.scaleToAxe.tickFormat( this.tickInfo.tickFormat );
        }
    }
}
