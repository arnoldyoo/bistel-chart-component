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
        this._showZeroLine();
        /*
        if (this.numeric_min && this.numeric_max && this.numeric_min < 0) {
            const temp_range: Array<number> = [];
            if (this.type === 'y') {
                temp_range.push(0);
                temp_range.push(this.width);
            } else {
                temp_range.push(this.height);
                temp_range.push(0);
            }
            const temp_scale: any = this._scale = d3.scale.linear()
                                .domain([this.numeric_min, this.numeric_max])
                                .range(temp_range);

            const scaley: number = temp_scale(0);
            this.target.attr('transform', `translate(${this.margin.left}, ${scaley + this.margin.top}) `);
        } else {
            super._updateContainerPosition();
        }
        */
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

        }
    }
}
