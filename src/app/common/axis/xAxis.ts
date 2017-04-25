import { Axis } from './axis';
export class XAxis extends Axis {
    orient: string;
    constructor() {
        super();
        // make Axis
    }
    updateDisplay(width: number, height: number): void{
        this.target.append('rect').attr('width', width)
                                    .attr('height', 10);
    }
    makeAxisLabel(): void {

    }
}
