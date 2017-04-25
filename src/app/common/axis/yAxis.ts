import { Axis } from './axis';
export class YAxis extends Axis {
    orient: string;
    constructor() {
        super();
        // make axis
    }
    updateDisplay(width: number, height: number): void {
        this.target.append('rect').attr('width', 10)
                                    .attr('height', height);
    }

    makeAxisLabel(): void {
    }
}
