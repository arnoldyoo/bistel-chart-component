import { Axis } from './axis';
export class YAxis extends Axis {
    constructor(axisConfig: any, axisTarget: any, width: number, height: number, margin: any) {
        super(axisConfig, axisTarget, width, height, margin);
        // make Axis
    }
    updateDisplay(width: number, height: number): void {
        if (this.orient === 'right') {
            this.target.attr('transform', `translate(${this.width}, 0)`);
        } else {
            this.target.attr('transform', `translate(${this.margin.left}, 0)`);
        }
        super.updateDisplay(width, height);
    }

    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }
}
