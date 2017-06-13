import { Legend } from '../../legend/legend';
import { LegendConfiguration } from '../../../model/legend.interface';

export class SvgLegend extends Legend {

    rectWidth= 10;
    rectHeight = 10;
    padding = 15;

    constructor(legendConfig: LegendConfiguration) {
        super(legendConfig);
    }

    updateDisplay() {
        super.updateDisplay();

        const items: Array<any> = [];
        const compareWidth: number = d3.select(this.container[0][0].parentElement).node().getBBox().width - 50;
        const orient: string = this.orient;
        const currentX = 0;
        const currentY = 0;
        const rowCnt = 0;
        const rowX = 0;
        const row: any = this.container.append('g')
            .attr('class', 'legendRow')
            .attr('legendRow', rowCnt)
            .attr('transform', `translate(0,0)`);

        this.series_config.map((d, i) => {
            items[d.displayName] = {
                name: d.displayName,
                color: this.colors[i]
            };
            const item = row.append('g')
                .attr('class', 'legendItem')
                .attr('legendName', d.displayName)
                .attr('transform', `translate(${currentX}, ${currentY})`);

            const backgroud = item.append('rect')
                .attr('width', this.rectWidth * 3)
                .attr('height', this.rectHeight)
                .style('stroke', 'none')
                .style('fill', '#fff');
                // why? mouseover out이 rect 와 text 나뉘어서 발생하는 것을 막기위함.

            const rect = item.append('rect')
                .attr('width', this.rectWidth)
                .attr('height', this.rectHeight)
                .style('fill', items[d.displayName].color);

            const text = item.append('text')
                .attr('y', '0.8em')
                .attr('x', 12)
                .style('font-size', '12px')
                .text( d.displayName );
        });




    }

}

