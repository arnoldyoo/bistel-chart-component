import { DateTimeAxis, CategoryAxis, NumericAxis } from './component/axis';
import { ColumnSeries, LineSeries } from './component/series';
import { AxisParam, SeriesParam } from './../model/chart-param.interface';

export class InstanceLoader {
    ctors: any;

    constructor() {
        this._settingInstance();
    }

    _settingInstance() {
        this.ctors = {
            CategoryAxis: CategoryAxis,
            NumericAxis: NumericAxis,
            DateTimeAxis: DateTimeAxis,
            ColumnSeries: ColumnSeries,
            LineSeries: LineSeries
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
    axisFactory(name: string, axisparams: AxisParam): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(axisparams);
        return classInstance;
    }

    // name: string, config: any, target: any, margin: any
    seriesFactory(name: string, seriesparams: SeriesParam): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(seriesparams);
        return classInstance;
    }
};

