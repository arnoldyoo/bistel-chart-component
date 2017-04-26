import { Axis } from './axis';
export class XAxis extends Axis {
    constructor(axisConfig: any, axisTarget: any, width: number, height: number) {
        super(axisConfig, axisTarget, width, height);
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        if (this.orient === 'bottom') {
            this.target.attr('transform', `translate(0, ${this.height})`);
        } else {
            this.target.attr('transform', 'translate(0, 0)');
        }
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }
}
