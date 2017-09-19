import { ChartEventData, ChartEvent } from '../../event/index';
import { ChartPlugin } from '../chart-plugin';

export class MultiBrushPlugin extends ChartPlugin {

    offsetX = 0; // start x
    offsetY = 0; // start y
    moveX = 0;
    moveY = 0;
    count = 3;
    i = 0;


    private marginLeft = 0;
    private marginTop = 0;

    private _direction: string = 'horizontal'; // default : horizontal, etc : vertical, both
    private _orient: string = 'bottom';
    private _callback: any;
    private isDragging: boolean = false;
    private randomTempUid: number;
    private uid: number;

    private mouseDowns: any;
    private mouseUps: any;
    private mouseMoves: any;
    private dragStart: any;

    private targetRect: any;
    private scale: any;
    private targetRectWidth: number;
    private targetRectHeight: number;
    private container: any;
    private containerRect: any;
    private currentRect: any;

    set direction(value: string) {
        this._direction = value;
    }

    get direction() {
        return this._direction;
    }

    get events() {
        return [ChartEvent.DRAG_START, ChartEvent.DRAG_MOVE, ChartEvent.DRAG_END ];
    }

    constructor(target: any, configuration?: any) {
        super(target, configuration);
        if (configuration) {
            this.direction = configuration.direction;
            this._orient = configuration.orient;
            this._callback = configuration.callback;
        }
        this._createContainer();
        // get parent group element translate for setup margin
        const ytarget = this.target.select('g.background');
        const yposition = d3.transform(ytarget.attr('transform')).translate;
        this.marginTop = yposition[1];
        this.marginLeft = yposition[0];
        this.targetRect = this.target.select('g.background').select('rect');

    }

    _createContainer() {
        this.container = this.target.append('g').attr('class', 'multibrush');
        this.containerRect = this.container.append('rect').style('fill-opacity', 0);
    }

    _getScale(width: number, height: number ) {
        const targetDomain = this.target.select(`.x.${this._orient}`)[0][0].__chart__.domain();
        this.scale = d3.time.scale()
                                .domain([targetDomain[0].getTime(), targetDomain[1].getTime()])
                                .range([0, width]);

        // this._addBrush(this.target);
        this._addDragRect();

    }

    // _addBrush(target: any) {
    //     const container = target.select('.multibrush');
    //     console.log('container', container);
    //     const brush = d3.svg.brush()
    //         .x(this.scale)
    //         .on('brush', (event) => {
    //             console.log('brush : ', event);
    //         }) //Make sure don't pass surrounding brushes
    //         .on('brushstart', (event) => {
    //             console.log('brushstart', event);
    //         })
    //         .on('brushend', (event) => {
    //             console.log('brushend', event);
    //         }); //Keep track of what brushes is surrounding
    //     console.log(brush);
    //     console.log(this.scale);

    //     container.call(brush);

    //     container.select('.background').attr('width', this.targetRectWidth).attr('height', this.targetRectHeight);
    // }

    _addDragRect() {
        this.containerRect
            // .on('click', () => {
            //     console.log('click');
            //     // 현재 가지고 있는 uid 를 select하여 삭제
            //     // randomTempUid, uid 초기화
            //     // this.container.select(`.brush-${this.randomTempUid}`).remove();

            // })
            .on('click', null)
            .on('mousedown', () => {
                // randomTempUid 생성
                this.randomTempUid = Math.round( Math.random() * 1000 );
                this.offsetX = d3.event.clientX - this.marginLeft;
                this.currentRect = this.container.append('rect').attr('class', `brush-${this.randomTempUid}`).style('fill', 'grey')
                .style('fill-opacity', 0.7).attr('x', this.offsetX).attr('y', 0);
                this.container.on('mousemove', () => {
                    this.moveX = d3.event.clientX - 10 - this.marginLeft;
                    if (this.moveX - this.offsetX > 10) {
                        // uid 저장
                        this.uid = this.randomTempUid;
                        this.isDragging = true;
                        const widthCompare: number = this.moveX - this.offsetX;
                        this.currentRect.attr('width', widthCompare < 0 ? 0 : widthCompare ).attr('height', this.targetRectHeight);
                    } else {
                        this.isDragging = false;
                    }
                });
            })
            .on('mousemove', null)
            .on('mouseup', () => {
                this.container.on('mousemove', null);
                const dates: Array<any> = [];
                dates.push(this.scale.invert(this.offsetX));
                dates.push(this.scale.invert(this.moveX));
                if (this.isDragging) {
                    this._callback.call(this, dates, d3.event, this.uid);
                    this.isDragging = false;
                    this.container.on('click', null);
                } else {
                    this.container.on('click', () => {
                        this.container.select(`.brush-${this.uid}`).remove();
                    });
                }
            });
    }

    updateDisplay(width?: number, height?: number) {
        this.container.attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`);
        this.targetRectWidth = +this.targetRect.attr('width');
        this.targetRectHeight = +this.targetRect.attr('height');
        console.log('size : ', this.targetRectWidth, this.targetRectHeight, this.targetRect);

        // this.container.selectAll('rect').attr('height', this.targetRectHeight);
        this.containerRect.attr('width', this.targetRectWidth).attr('height', this.targetRectHeight);
        this._getScale(this.targetRectWidth, this.targetRectHeight);
    }

    _removeEvent() {
        this.containerRect
            .on('mousemove', null)
            .on('mousedown', null)
            .on('mouseup', null)
            .on('click', null);
    }

    disabled() {
        super.disabled();
        this._removeEvent();
    }

    enabled() {
        super.enabled();
        this._addDragRect();
    }
}
