import { AxisParam } from './../../model/ChartParam.interface';
import { Axe } from './axe';
import { Axis } from './axis';
export class DateTimeAxis extends Axis {
    _scale: any;
    _customTimeFormat: any;
    constructor(axisparams: AxisParam) {
        super(axisparams);
        // make Axis
        this._customTimeFormat = d3.time.format.multi([
                ['.%L', function(d) { return d.getMilliseconds(); }],
                [':%S', function(d) { return d.getSeconds(); }],
                ['%H:%M', function(d) { return d.getMinutes(); }],
                ['%H:%M', function(d) { return d.getHours(); }],
                ['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
                ['%b %d', function(d) { return d.getDate() != 1; }],
                ['%B', function(d) { return d.getMonth(); }],
                ['%Y', function() { return true; }]
             ]);
    }
    updateDisplay(width: number, height: number): void {
        super.updateDisplay(width, height);
    }
    // 재정의
    makeAxisLabel(): void {
        super.makeAxisLabel();
        this.target.call(this.axe.scaleToAxe);
    }

    scaleSetting(): void {
        super.scaleSetting();
        this._scale = d3.time.scale()
                                .domain(this.domain)
                                .range([0, this.width]);
    }
    scaleToAxeSetting(): void {
        super.scaleToAxeSetting();
        this.axe = new Axe();
        this.axe.scale = this._scale;
        this.axe.scaleToAxe = d3.svg.axis()
                                .scale(this._scale)
                                .orient(this.orient);
        this.axe.scaleToAxe.tickFormat(this._customTimeFormat);
        if (this.tickInfo.ticks) {
            this.axe.scaleToAxe.ticks(this.tickInfo.ticks);
        }
    }
}
