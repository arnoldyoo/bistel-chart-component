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
        const mouseMoves = Observable.fromEvent(target[0][0], 'mousemove');
        let dragStart: Observable<any>;

        dragStart = mouseDowns.debounceTime(2000);
        dragStart.subscribe( (e: any) => {
            this.offsetX = e.offsetX + 1;
            this.offsetY = e.offsetY + 1;
            console.log( 'dragstart x: ', this.offsetX, 'y:', this.offsetY );
        });

        dragStart.map(function () {
            return mouseMoves.takeUntil(mouseUps);
        })
        .concatAll()
        .subscribe( (e: any) => {
            this.moveX = e.x - this.offsetX;
            this.moveY = e.y - this.offsetY;
            // move가 되는 동안에 d3 rect를 그려준다.
        });

        mouseUps.subscribe( (e: any) => {
            this.moveX = e.offsetX - 1;
            this.moveY = e.offsetY - 1;
            const dragable: Dragable = new Dragable(this.offsetX, this.offsetY, this.moveX, this.moveY);
            dispatchEvent(new CustomEvent(DragBase.DRAG_END, {
                detail: dragable
            }));
            console.log( 'mouseUps x: ', this.moveX, 'y:', this.moveY );
        });
    }
}
