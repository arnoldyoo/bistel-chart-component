import { Legend } from '../../legend/legend';
import { LegendConfiguration } from '../../../model/legend.interface';

export class SvgLegend extends Legend {

    rectWidth= 10;
    rectHeight = 10;
    padding = 10;

    constructor(legendConfig: LegendConfiguration, chartSelector: string) {
        super(legendConfig, chartSelector);
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
        const items: Array<any> = [];
        const compareWidth: number = this.width - 50;
        const orient: string = this.orient;
        let currentX = 0;
        let currentY = 5;
        let rowCnt = 0;

        this.container.attr('class', 'legend-group')
                      .attr('transform', 'translate(0, 0)');

        this.container.selectAll('*').remove();

        let row: any = this.container.append('g')
            .attr('class', 'legend-row')
            .attr('transform', `translate(0,0)`);
        rowCnt++;
        this.series_config.map((d, i) => {

            items[d.displayName] = {
                name: d.displayName,
                color: this.colors[i]
            };

            const item = row.append('g')
                .attr('class', 'legend-item')
                .attr('legend-name', d.displayName)
                .attr('transform', `translate(${currentX}, ${currentY})`);

            const rect = item.append('rect')
                .attr('width', this.rectWidth)
                .attr('height', this.rectHeight)
                .style('fill', items[d.displayName].color);

            const text = item.append('text')
                .attr('y', '0.8em')
                .attr('x', 12)
                .style('font-size', '12px')
                .text( d.displayName );

            item.append('rect')
                .attr('width', item.node().getBBox().width)
                .attr('height', item.node().getBBox().height)
                .style('fill', '#fff')
                .style('opacity', 0);

            if ( compareWidth - this.padding < currentX + text.node().getBBox().width + ( this.rectWidth + this.padding ) ) {
                currentX = 0;
                currentY += item.node().getBBox().height + 2;

                row = this.container.append('g')
                    .attr('class', 'legend-row')
                    .attr('transform', `translate(0,0)`);
                rowCnt++;
                row.append( () => {
                    return item.node();
                });
            }

            item.attr('transform', `translate( ${currentX}, ${currentY} )` );
            currentX += item.node().getBBox().width + this.padding;
            this._addEvent(item);
        });

        const group_width: number = this.container.node().getBBox().width;
        const repositionX: number = (this.width / 2) - (group_width / 2);
        this.container.attr('transform', `translate(${repositionX},${0})`);

        if (rowCnt > 1) {
            this.container.selectAll('.legend-row')
                .attr('transform', function(){
                    const curRow = d3.select(this);
                    const xRowPosition: number = ( compareWidth / 2 - curRow.node().getBBox().width / 2 - 30 );
                    return `translate( ${xRowPosition}, 0 )`;
                });
        }
    }

    _addEvent(item: any) {
        if (!this.chart_selector) {
            return;
        }
        const chart = d3.select(this.chart_selector);
        item.on('mouseover', () => {
            const that: any = d3.select(d3.event.target.parentElement);
            that.style('opacity', 1);
            const other: any = this.container.selectAll('.legend-item').filter( function() {
                const lgname: any = d3.select(this).attr('legend-name');
                return lgname !== that.attr('legend-name');
            });
            other.style('opacity', 0.4);
            const selflg = that.attr('legend-name');
            const otherbar = chart.selectAll('[data-legend]').filter( function() {
                return d3.select(this).attr('data-legend') !== selflg;
            });
            const selfbar = chart.selectAll('[data-legend]').filter( function() {
                return d3.select(this).attr('data-legend') === selflg;
            });
            otherbar.style('stroke', 'none');
            otherbar.style('opacity', 0.4);
            selfbar.style('opacity', 1);
            selfbar.style('stroke', 'black');
        }).on('mouseout', () => {
            const selfbar = chart.selectAll('[data-legend]').filter( function() {
                return true;
            });
            selfbar.style('opacity', 1);
            selfbar.style('stroke', 'none');
            const other = this.container.selectAll('.legend-item').filter( function() {
                return true;
            });
            other.style('opacity', 1);
        }).on('click', (  ) => {
            const selflg = d3.select(d3.event.target.parentElement).attr('legend-name');
            const otherbar = chart.selectAll('[data-legend]').filter( function() {
                return d3.select(this).attr('data-legend') !== selflg;
            });
            const selfbar = chart.selectAll('[data-legend]').filter( function() {
                return d3.select(this).attr('data-legend') === selflg;
            });
            otherbar.style('stroke', 'none');
            otherbar.style('opacity', 0.4);
            selfbar.style('opacity', 1);
            selfbar.style('stroke', 'black');
        });
    }

}

