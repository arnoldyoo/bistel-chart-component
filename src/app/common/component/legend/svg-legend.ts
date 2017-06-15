import { Legend } from '../../legend/legend';
import { LegendConfiguration } from '../../../model/legend.interface';

export class SvgLegend extends Legend {

    rectWidth= 10;
    rectHeight = 10;
    padding = 15;
    rowX = 0;

    constructor(legendConfig: LegendConfiguration) {
        super(legendConfig);
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
        const items: Array<any> = [];
        const compareWidth: number = d3.select(this.container[0][0].parentElement).node().getBBox().width - 50;
        const orient: string = this.orient;
        let currentX = 0;
        let currentY = 10;
        let rowCnt = 0;
        const rowX = 0;
        let row: any = this.container.append('g')
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
            /*
            item.on('mouseover', function( d ){
                var that = d3.select(this);
                that.style('opacity', 1);
                var other = g.selectAll('.legendItem').filter( function(d){
                        var lgname = d3.select(this).attr('legendName');
                        return lgname === that.attr('legendName')? false: true;
                } );
                other.style('opacity', 0.4);
                var selflg = that.attr('legendName');
                var otherbar = svg.selectAll("[data-legend]").filter( function(d){
                        return d[0].series === selflg? false: true;
                } );
                var selfbar = svg.selectAll("[data-legend]").filter( function(d){
                        return d[0].series === selflg? true: false;
                } );
                otherbar.style('stroke', 'none');
                otherbar.style('opacity', 0.4);
                selfbar.style('opacity', 1);
                selfbar.style('stroke', 'black');

            }).on('mouseout', function( d ){
                    var selfbar = svg.selectAll("[data-legend]").filter( function(d){
                        return true;
                } );
                selfbar.style('opacity', 1);
                selfbar.style('stroke', 'none');
                var other = g.selectAll('.legendItem').filter( function(d){
                        return true;
                } );
                other.style('opacity', 1);
            }).on('click', function( d ){
                var selflg = d3.select(this).attr('legendName');
                var otherbar = svg.selectAll("[data-legend]").filter( function(d){
                        return d[0].series === selflg? false: true;
                } );
                var selfbar = svg.selectAll("[data-legend]").filter( function(d){
                        return d[0].series === selflg? true: false;
                } );
                otherbar.style('stroke', 'none');
                otherbar.style('opacity', 0.4);
                selfbar.style('opacity', 1);
                selfbar.style('stroke', 'black');
            });
            */
            // const backgroud = item.append('rect')
            //     .attr('width', this.rectWidth * 3)
            //     .attr('height', this.rectHeight)
            //     .style('stroke', 'none')
            //     .style('fill', '#fff');
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

            // currentX += 100;
            // bottom인 경우 set position
            // why? 사이즈가 넘어가는 체크하여 밑으로 내린다.
            if ( compareWidth - this.padding < currentX + text.node().getBBox().width + ( this.rectWidth + this.padding ) ) {
                currentX = 0;
                currentY += this.rectHeight + 2;
                rowCnt++;
                row = this.container.append('g')
                    .attr('class', 'legendRow')
                    .attr('legendRow', rowCnt)
                    .attr('transform', 'translate( 0, 0 )' );
                // 다른 row에 넣는다.
                const newitem = item.remove();
                row.append( () => {
                    return item.node();
                } );
                this.rowX = ( compareWidth / 2 - row.node().getBBox().width / 2 - 30 );
            }

        item.attr('transform', `translate( ${currentX}, ${currentY} )` );

        currentX += text.node().getBBox().width + ( this.rectWidth + this.padding );
    });

    // this.container.selectAll('.legendRow')
    //                 .attr('transform', () => {
    //                     const curRow = d3.select(this);
    //                     this.rowX = ( compareWidth / 2 - curRow.node().getBBox().width / 2 - 30 );
    //                     return `translate( ${rowX}, 0 )`;
    //                 } );
    }
}

