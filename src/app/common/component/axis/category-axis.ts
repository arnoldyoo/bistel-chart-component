import { Axe } from './../../axis/axe';
import { AxisConfiguration } from './../../../model/chart-param.interface';
import { Axis } from '../../axis/axis';

export class CategoryAxis extends Axis {
    _scale: any;
    _zero: any;

    constructor(axisconfig: AxisConfiguration) {
        super(axisconfig);
        // make Axis
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel() {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
        if (this.tickInfo.rotate) {
            this._tickRotate();
        }
    }

    _updateContainerPosition() {
        super._updateContainerPosition();
        if (this.numeric_min && this.numeric_max && this.numeric_min < 0) {
            this._showZeroLine();
        };
    }

    scaleSetting() {
        super.scaleSetting();
        this._scale = d3.scale.ordinal()
                                .domain(this.domain)
                                .rangeBands( this._range, .1 );
    }

    scaleToAxeSetting() {
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

    _domainTruncate() {
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

    _tickRotate() {
        this.target.selectAll('text').style('text-anchor', 'start')
                                     .attr('transform', d => {
                                       return 'rotate(45)';
                                      });
    }

    _showZeroLine() {
        if (this._zero) {
            this._zero.remove();
        }
        const rootSvg: any = d3.select(this.target[0][0].nearestViewportElement);
        this._zero = rootSvg.append('g').attr('class', 'zero');
        this._zero.attr('transform', `translate(${this.margin.left}, ${this._getNumericScale() + this.margin.top})`);

        const median: any = this._zero.append('line');
        median.attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', this.width)
                .attr('y2', 0)
                .attr('stroke-width', 1)
                .attr('stroke', 'black');
    }

    _getNumericScale(): any {
        const temp_range: Array<number> = [];
        if (this.type === 'y') {
            temp_range.push(0);
            temp_range.push(this.width);
        } else {
            temp_range.push(this.height);
            temp_range.push(0);
        }
        const temp_scale: any = d3.scale.linear()
                            .domain([this.numeric_min, this.numeric_max])
                            .range(temp_range);

        const scaley: number = temp_scale(0);
        console.log(scaley);
        return scaley;
    }
}
