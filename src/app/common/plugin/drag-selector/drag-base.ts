import { Observable } from 'rxjs/Observable';
import { Dragable } from './model/drag-model';
import { ChartPlugin } from '../chart-plugin';
import { ChartEvent } from '../../event/index';
import { ChartEventData } from '../../event/chart-event.interface';

export class DragBase extends ChartPlugin {

    offsetX = 0; // start x
    offsetY = 0; // start y
    moveX = 0;
    moveY = 0;

    private marginLeft = 0;
    private marginTop = 0;

    private _direction = 'horizontal'; // default : horizontal, etc : vertical, both

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
        }
        // get parent group element translate for setup margin
        const ytarget = this.target.select('g.background');
        const yposition = d3.transform(ytarget.attr('transform')).translate;
        this.marginTop = yposition[1];
        this.marginLeft = yposition[0];
    }

    _addEvent(target) {
        const mouseDowns = Observable.fromEvent(target[0][0], 'mousedown');
        const mouseUps = Observable.fromEvent(target[0][0], 'mouseup');
        const mouseMoves = Observable.fromEvent<MouseEvent>(target[0][0], 'mousemove');
        let dragStart: Observable<any>;

        mouseDowns.subscribe(() => {
            target.select('.selection_box').remove();
        });

        dragStart = mouseDowns.flatMap(() =>
                                        mouseMoves
                                            .filter(x => { return  x.movementX !== 0 || x.movementY !== 0})
                                            .takeUntil(mouseUps)
                                            .take(1)
                                    );
        dragStart.subscribe( (e: any) => {
            this.offsetX = e.offsetX + 1;
            this.offsetY = e.offsetY + 1;
            target.append( 'rect')
                .attr('class', 'selection_box')
                .attr('x', this.offsetX)
                .attr('y', this.offsetY)
                .attr('width', 0)
                .attr('height', 0)
                .style('fill', 'grey')
                .style('fill-opacity', 0.5);
        });

        dragStart.map( () => {
            return mouseMoves.takeUntil(mouseUps);
        })
        .concatAll()
        .subscribe( (e: any) => {
            this.moveX = e.offsetX - this.offsetX;
            this.moveY = e.offsetY - this.offsetY;
            // move가 되는 동안에 d3 rect를 그려준다.
            this.updateDisplay();
        });

        mouseUps.subscribe( (e: any) => {
            this.moveX = e.offsetX - 1;
            this.moveY = e.offsetY - 1;
            const s_box: any = this.target.select('.selection_box');
            console.log('1. mouse up!');
            if (s_box[0][0]) {
                console.log('2. mouse up!');
                const targetBox = d3.select(s_box[0][0]);
                const startX = +targetBox.attr('x');
                const startY = +targetBox.attr('y');
                const moveX = startX + (+targetBox.attr('width'));
                const moveY = startY + (+targetBox.attr('height'));
                // minus margin position for original position
                const dragEvent: Dragable = new Dragable(startX - this.marginLeft, startY - this.marginTop, moveX - this.marginLeft, moveY - this.marginTop);
                const event = new ChartEventData( e, dragEvent, ChartEvent.DRAG_END );
                this.dispatchEvent( ChartEvent.PLUGIN_EVENT, event );
            }
        });
    }

    updateDisplay(width?: number, height?: number) {
        const s_box: any = this.target.select('.selection_box');
        if ( !s_box.empty()) {
            const ytarget = this.target.select('g.background');
            const yposition = d3.transform(ytarget.attr('transform')).translate;
            const mX = (this.moveX < 0 ? 0 : this.moveX);
            const mY = (this.moveY < 0 ? 0 : this.moveY);
            if (this.direction === 'horizontal') {
                s_box.attr('y', this.marginTop);
                s_box.attr('height', ytarget.node().getBoundingClientRect().height);
                s_box.attr('width', mX);
            } else if (this.direction === 'vertical') {
                s_box.attr('x', this.marginLeft);
                s_box.attr('width', ytarget.node().getBoundingClientRect().width);
                s_box.attr('height', mY);
            } else {
                s_box.attr('width', mX);
                s_box.attr('height', mY);
            }
        }
    }
}
