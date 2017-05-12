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
        if (this.tickInfo.rotate) {
            this._tickRotate();
        }
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


        if (this.tickInfo.ticks) {
            const domain_length: number = this.axe.scale.domain().length;
            if ((domain_length / 2) < this.tickInfo.ticks) {
                return;
            } else {
                this._domainTruncate();
            }
        }
    }
    _domainTruncate(): void {
        let ticksize: number = Math.round(this.axe.scale.domain().length / this.tickInfo.ticks);
        if (this.tickInfo.ticks % 2) {
            ticksize = ticksize + 1;
        }
        const tempArray: Array<any> = this.axe.scale.domain().map((d, i) => {
            if (i === 0) {
                return d;
            } else {
                if (i % ticksize === 0) {
                    return d;
                } else {
                    return 0;
                }
            }
        });
        const tickArray: Array<any> = tempArray.filter(d =>  d !== 0 );
        this.axe.scaleToAxe.tickValues(tickArray);
    }
    _tickRotate(): void {
        this.target.selectAll('text').style('text-anchor', 'start')
                                     .attr('transform', function(d) {
                                       return 'rotate(45)';
                                      });
    }
}
