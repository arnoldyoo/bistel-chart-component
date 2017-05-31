import { Series } from './../../series/Series';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class PieSeries extends Series {

    _seriesCnt: number;
    _seriesIndex: number;
    _innerRadius: number;
    _outerRadius: number;
    _pie: any;
    _radius: number;
    _arc: any;
    _pieData: Array<any>;
    _piecolor: any;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this._pie = d3.layout.pie();
        this._index = 0;
        this.seriesIndex = 0;

    }

    set seriesCnt( value: number ) {
        this._seriesCnt = value;
    }

    get seriesCnt() {
        return this._seriesCnt;
    }

    set seriesIndex(value: number) {
        this._seriesIndex = value;
    }

    get seriesIndex(): number {
        return this._seriesIndex;
    }

    set innerRadius(value: number) {
        this._innerRadius = value;
    }

    get innerRadius() {
        return this._innerRadius;
    }

    set outerRadius(value: number) {
        this._outerRadius = value;
    }

    get outerRadius() {
        return this._outerRadius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get radius() {
        return this._radius;
    }

    dataSetting() {
        super.dataSetting();
        if (this.dataProvider) {
            this._pieData = [];
            this.dataProvider.map(data => {
                this._pieData.push(data[this.xField]);
            });
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        if (!this.radius) {
            this.radius = Math.min(this.width, this.height) / 2;
        }
        this._createArc();
        this.target.attr('height', this.height)
                    .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    }

    updateDisplay() {
        this.generatePosition();
        this._piecolor = d3.scale.category20();
        const pieTarget = this.target.selectAll('path')
            .data(this._pie(this._pieData))
            .enter();
        pieTarget.append('path')
            .style('fill', (d, i) => {
                return this._piecolor(i);
            })
            .attr('class', this.displayName + this._index)
            .attr('d', this._arc);

        if ( this.label ) {
            const label: any = this._createLabel();
            pieTarget.append('text')
                        .attr('transform', (d) => {
                            return `translate(${label.centroid(d)})`;
                        })
                        .attr('dy', '0.35em')
                        .text((d) => {
                            return d.value;
                        });
        }
    }

    createItem() { }

    _createArc() {

        this.innerRadius = this.radius * this.seriesIndex;
        this.outerRadius = this.innerRadius + this.radius;
        this._arc = d3.svg.arc()
                          .innerRadius(this.innerRadius)
                          .outerRadius(this.outerRadius);
    }

    _createLabel() {
        const label_position = (this.innerRadius + this.outerRadius) / 2;
        return d3.svg.arc()
                     .innerRadius(label_position)
                     .outerRadius(label_position);
    }

};
