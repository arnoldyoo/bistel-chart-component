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

        if ( this.label.visible ) {
            if (this.label.side === 'in') {
                const label: any = this._createInnerLabel();
                pieTarget.append('text')
                          .attr('transform', (d) => {
                              return `translate(${label.centroid(d)})`;
                          })
                          .attr('dy', '0.35em')
                          .text((d) => {
                              return d.value;
                          });
            } else {
                const outsideLabel: any = this._createOutsideLabel();
                const arc: any = this._createArc();

                pieTarget.append('text')
                         .attr('text-anchor', 'middle')
                         .attr('transform', (d) => {
                             const pos: any = outsideLabel.centroid(d);
                             pos[0] = this.radius * 1.7 * (this._midAngle(d) < Math.PI ? 0.97 : -0.97);
                             return `translate(${pos})`;
                         })
                         .text((d) => {
                             return d.value;
                         });

                pieTarget.append('g')
                         .append('polyline')
                         .attr('points', (d) => {
                             const pos = outsideLabel.centroid(d);
                             pos[0] = this.radius * 1.55 * (this._midAngle(d) < Math.PI ? 1 : -1);
                             return [this._arc.centroid(d), outsideLabel.centroid(d), pos];
                         })
                         .style('fill', 'none')
                         .style('stroke', 'black')
                         .style('stroke-width', '1px');

            }
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

    _createInnerLabel() {
        const label_position = (this.innerRadius + this.outerRadius) / 2;
        return d3.svg.arc()
                     .innerRadius(label_position)
                     .outerRadius(label_position);
    }

    _createOutsideLabel() {
        return d3.svg.arc()
                     .innerRadius(this.radius * 1.5)
                     .outerRadius(this.radius * 1.5);
    }

    _midAngle(data: any) {
        return data.startAngle + (data.endAngle - data.startAngle) / 2;
    }

};
