import { Axis } from './axis';
export class XAxis extends Axis {
    margin: any;
    constructor(axisConfig: any, axisTarget: any, width: number, height: number, margin: any) {
        super(axisConfig, axisTarget, width, height);
        this.margin = margin;
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        if (this.orient === 'bottom') {
            this.target.attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`);
        } else {
            this.target.attr('transform', `translate(${this.margin.left}, 0)`);
        }
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }
}
