import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';

export class LineSeries extends Series {

    private _line: any;
    private _defs: any;
    private _filteredDataProvider: Array<any>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.index = 0;
    }

    dataSetting() {
        super.dataSetting();
        if (this.dataProvider) {
            this._filteredDataProvider = this.filteringDataProvider(this.dataProvider);
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        this._line = d3.svg.line()
            .x((d: any) => {
                return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this.xField]);
            })
            .y((d: any) => {
                return this.yAxe.scale(d[this.yField]);
            })
            .interpolate('interpolate');
    }

    updateDisplay() {
        this.generatePosition();
        let svgElement: any = this.target.select(`.${this.displayName + this.index}`);

        if (!svgElement[0][0]) {
            svgElement = this.createItem();
        } else {
            svgElement.datum(this._filteredDataProvider);
        }
        svgElement.attr('d', this._line);
        this._defs.select('rect').attr('width', this.width).attr('height', this.height);

        this.target.selectAll('.dot').remove();
        this.target.selectAll('.dot')
                .data(this._filteredDataProvider)
            .enter().append('circle') // Uses the enter().append() method
                .attr('class', 'dot') // Assign a class for styling
                .attr('cx', (d, i) => { return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this.xField]); })
                .attr('cy', (d) => { return this.yAxe.scale(d[this.yField]) })
                .attr('r', 2)
                .attr('clip-path', `url(#${this.displayName + this.index}-clip-path)`)
                .attr('fill', this.color);
    }

    createItem() {
        this._defs = this.target.append('defs');
        this._defs.append('clipPath').attr('id', `${this.displayName + this.index}-clip-path`).append('rect');
        return this.target.datum(this._filteredDataProvider)
                            .append('path')
                            .style('stroke', this.color)
                            .attr('clip-path', `url(#${this.displayName + this.index}-clip-path)`)
                            .attr('class', this.displayName + this.index);
    }

}
