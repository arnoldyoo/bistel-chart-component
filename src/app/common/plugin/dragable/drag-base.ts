import { Observable } from 'rxjs/Observable';
import { Dragable } from './model/drag-model';

export class DragBase {
    static DRAG_START = 'drag_start';
    static DRAG_MOVE = 'drag_move';
    static DRAG_END = 'drag_end';

    private _target: any;
    private _eventMap: any = {};

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

    addEventListner(type: string, method: any) {
        this._eventMap[type] = method;
    }

    private _addEvent(target) {
        const mouseDowns = Observable.fromEvent(target[0][0], 'mousedown');
        const mouseUps = Observable.fromEvent(target[0][0], 'mouseup');
        const mouseMoves = Observable.fromEvent(target[0][0], 'mousemove');

        mouseDowns.map(function () {
            return mouseMoves.takeUntil(mouseUps);
        })
        .concatAll()
        .subscribe( (e: any) => {
            this.moveX = e.x - this.offsetX;
            this.moveY = e.y - this.offsetY;
            this._dispatchEvent(DragBase.DRAG_MOVE);
            // console.log( 'left: ', leftp, 'top:', topp );
        });

        mouseDowns.subscribe( (e: any) => {
            this.offsetX = e.offsetX + 1;
            this.offsetY = e.offsetY + 1;
            this._dispatchEvent(DragBase.DRAG_START);
            console.log( 'mouseDowns x: ', this.offsetX, 'y:', this.offsetY );
        });

        mouseUps.subscribe( (e: any) => {
            this.moveX = e.offsetX - 1;
            this.moveY = e.offsetY - 1;
            this._dispatchEvent(DragBase.DRAG_END);
            console.log( 'mouseUps x: ', this.moveX, 'y:', this.moveY );
        });
    }

    private _dispatchEvent(type: string) {
        if (this._eventMap[type]) {
            const dragable: Dragable = new Dragable(this.offsetX, this.offsetY, this.moveX, this.moveY);
            this._eventMap[type](dragable);
        }
    }
}
