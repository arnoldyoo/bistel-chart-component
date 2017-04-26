import { Axis } from './axis';
export class YAxis extends Axis {
    constructor(axisConfig: any, axisTarget: any, width: number, height: number) {
        super(axisConfig, axisTarget, width, height);
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        if (this.orient === 'right') {
            this.target.attr('transform', `translate(${this.width}, 0)`);
        } else {
            this.target.attr('transform', 'translate(0, 0)');
        }
        super.updateDisplay(width, height);
    }

    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axis);
    }
}
