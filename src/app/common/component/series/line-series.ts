import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';

export class LineSeries extends Series {

    private _line: any;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.index = 0;
    }

    dataSetting() {
        super.dataSetting();
        if (this.dataProvider) {
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
            svgElement.datum(this.dataProvider);
        }
        svgElement.attr('d', this._line);

        this.target.selectAll(".dot")
                .data(this.dataProvider)
            .enter().append("circle") // Uses the enter().append() method
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", (d, i) => { return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this.xField]); })
                .attr("cy", (d) => { return this.yAxe.scale(d[this.yField]) })
                .attr("r", 3)
                .attr('fill', this.color);
    }

    createItem() {
        return this.target.datum(this.dataProvider)
                            .append('path')
                            .style('stroke', this.color)
                            .attr('class', this.displayName + this.index);
    }

}
