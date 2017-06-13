import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LegendConfiguration } from '../../model/legend.interface';
import { SvgLegend } from '../../common/component/legend/svg-legend';
import { Legend } from '../../common/legend/legend';


@Component({
    selector: 'app-legend',
    templateUrl: 'legend.component.html',
    styles: ['legend.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LegendComponent implements OnInit {
    @Input() legendinfo: LegendConfiguration;
    @Input() series: any;
    legend: Legend;
    constructor() {
    }
    ngOnInit() {
        this.legend = new SvgLegend(this.legendinfo);
    }

}
