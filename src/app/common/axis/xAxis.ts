import { Axis } from './axis';
export class XAxis extends Axis {
    constructor(axisConfig: any, axisTarget: any, width: number, height: number, margin: any) {
        super(axisConfig, axisTarget, width, height, margin);
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        if (this.orient === 'bottom') {
            this.target.attr('transform', `translate(${this.margin.left}, ${this.height})`);
        } else {
            this.target.attr('transform', `translate(${this.margin.left}, 30)`);
        }
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }
}
