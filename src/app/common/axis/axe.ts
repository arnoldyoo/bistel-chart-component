export class Axe {
    scaleToAxe: any; // chart base reference, scale 적용된 axe
    scale: any;
    axeType: string; // x or y config.axe value
    width: number;
    height: number;
    dataType: string;
    domain: Array<any>;
    orient: string;

    constructor( axe: string, width: number, height: number, dataType: string, domain: Array<any>, orient: string ) {
        this._axeConfigSetting(axe, width, height, dataType, domain, orient);
        this._scaleSetting();
        this.scaleToAxeSetting();
        // d3 scale 설정
        // category, numeric, date
    }
    _axeConfigSetting(axe: string, width: number, height: number, dataType: string, domain: Array<any>, orient: string ): void {
        this.axeType = axe;
        this.width = width;
        this.height = height;
        this.dataType = dataType;
        this.domain = domain;
        this.orient = orient;
    }
    _scaleSetting(): void {
        if ( this.dataType === 'ordinal' ) {
            this.scale = d3.scale.ordinal()
                                    .domain(this.domain)
                                    .rangeRoundBands( [0, this.width], .1 );
        } else if ( this.dataType === 'numeric') {
            this.scale = d3.scale.linear()
                                    .domain(this.domain)
                                    .range([this.height, 0]);
        } else {
            this.scale = d3.time.scale()
                                    .domain(this.domain)
                                    .range([0, 100]);
        }
    }
    scaleToAxeSetting(): void {
        this.scaleToAxe = d3.svg.axis().scale(this.scale).orient(this.orient);
    }
}
