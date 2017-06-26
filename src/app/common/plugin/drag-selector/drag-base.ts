import { Observable } from 'rxjs/Observable';
import { Dragable } from './model/drag-model';


export class DragBase {
    static DRAG_START = 'drag_start';
    static DRAG_MOVE = 'drag_move';
    static DRAG_END = 'drag_end';

    private _target: any;

    offsetX = 0; // start x
    offsetY = 0; // start y
    moveX = 0;
    moveY = 0;

    set target(value: any) {
        this._target = value;
        if (this._target) {
            this._addEvent(this._target);
        }
    }

    get target() {
        return this._target;
    }

    constructor(target?: any) {
        if (target) {
            this.target = target;
        }
    }

    private _addEvent(target) {
        const mouseDowns = Observable.fromEvent(target[0][0], 'mousedown');
        const mouseUps = Observable.fromEvent(target[0][0], 'mouseup');
        const mouseMoves = Observable.fromEvent<MouseEvent>(target[0][0], 'mousemove');
        let dragStart: Observable<any>;

        mouseDowns.subscribe(() => {
            target.select('.selection_box').remove();
        });

        dragStart = mouseDowns.flatMap(() =>
                                        mouseMoves
                                            .filter(x => { console.log('movemonent', x.movementX); return  x.movementX !== 0 || x.movementY !== 0})
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

        dragStart.map(function () {
            return mouseMoves.takeUntil(mouseUps);
        })
        .concatAll()
        .subscribe( (e: any) => {
            this.moveX = e.offsetX - this.offsetX;
            this.moveY = e.offsetY - this.offsetY;
            // move가 되는 동안에 d3 rect를 그려준다.
            const s_box: any = target.select('.selection_box');
            if ( !s_box.empty()) {
                s_box.attr('width', this.moveX);
                s_box.attr('height', this.moveY);
            }

        });

        mouseUps.subscribe( (e: any) => {
            this.moveX = e.offsetX - 1;
            this.moveY = e.offsetY - 1;
            const dragable: Dragable = new Dragable(this.offsetX, this.offsetY, this.moveX, this.moveY);
            const s_box: any = target.select('.selection_box');
            if (s_box[0][0]) {
                dispatchEvent(new CustomEvent(DragBase.DRAG_END, {
                    detail: dragable
                }));
            }
        });
    }
}
