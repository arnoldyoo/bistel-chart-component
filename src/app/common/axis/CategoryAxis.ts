import { AxisParam } from './../../model/ChartParam.interface';
import { Axe } from './axe';
import { Axis } from './axis';
export class CategoryAxis extends Axis {
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
        this._scale = d3.scale.ordinal()
                                .domain(this.domain)
                                .rangeBands( [0, this.width], .1 );
    }

    scaleToAxeSetting(): void {
        super.scaleToAxeSetting();
        if (!this.axe) {
            this.axe = new Axe();
        }
        this.axe.scale = this._scale;
        this.axe.scaleToAxe = d3.svg.axis()
                                .scale(this._scale)
                                .orient(this.orient);
    }
}
