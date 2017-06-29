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
            const dragable: Dragable = new Dragable(this.offsetX, this.offsetY, this.moveX, this.moveY);
            const s_box: any = this.target.select('.selection_box');
            console.log('1. mouse up!');
            if (s_box[0][0]) {
                console.log('2. mouse up!');
                const event = new ChartEventData( e, dragable, ChartEvent.DRAG_END );
                this.dispatchEvent( ChartEvent.PLUGIN_EVENT, event );
            }
        });
    }

    updateDisplay(width?: number, height?: number) {
        const s_box: any = this.target.select('.selection_box');
        if ( !s_box.empty()) {
            const ytarget = this.target.select('g.background');
            const yposition = d3.transform(ytarget.attr('transform')).translate;

            if (this.direction === 'horizontal') {
                s_box.attr('y', yposition[1]);
                s_box.attr('height', ytarget.node().getBoundingClientRect().height);
                s_box.attr('width', this.moveX);
            } else if (this.direction === 'vertical') {
                s_box.attr('x', yposition[0]);
                s_box.attr('width', ytarget.node().getBoundingClientRect().width);
                s_box.attr('height', this.moveY);
            } else {
                s_box.attr('width', this.moveX);
                s_box.attr('height', this.moveY);
            }
        }
    }
}
