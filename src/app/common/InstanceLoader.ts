import { ColumnSeries } from './series/ColumnSeries';
import { AxisParam, SeriesParam } from './../model/ChartParam.interface';
import { NumericAxis } from './axis/NumericAxis';
import { CategoryAxis } from './axis/CategoryAxis';
import { DateTimeAxis } from './axis/DateTimeAxis';

export class InstanceLoader {
    ctors: any;
    constructor() {
        this._settingInstance();
    }

    _settingInstance(): void {
        this.ctors = {
            CategoryAxis: CategoryAxis,
            NumericAxis: NumericAxis,
            DateTimeAxis: DateTimeAxis,
            ColumnSeries: ColumnSeries
        };
    }
    _getCtor( name: string ): any {
        const ctor: any = this.ctors[name];
        if (!ctor) {
            return null;
        } else {
            return ctor;
        }
    }
    // name: string ,config: any, target: any, width: number, height: number, margin: Array<any>, domain: any
    axisFactory( name: string, axisparams: AxisParam ): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(axisparams);
        return classInstance;
    }
    // name: string, config: any, target: any, margin: any
    seriesFactory( name: string, seriesparams: SeriesParam ): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(seriesparams);
        return classInstance;
    }
};

