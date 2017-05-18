import { DateTimeAxis, CategoryAxis, NumericAxis } from './component/axis';
import { ColumnSeries, LineSeries, ColumnSet } from './component/series';
import { AxisConfiguration, SeriesConfiguration } from './../model/chart-param.interface';

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
            ColumnSet: ColumnSet,
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
    axisFactory(name: string, axisparams: AxisConfiguration): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(axisparams);
        return classInstance;
    }

    // name: string, config: any, target: any, margin: any
    seriesFactory(name: string, seriesparams: SeriesConfiguration): any {
        const ctor: any = this._getCtor(name);
        const classInstance: any = new ctor(seriesparams);
        return classInstance;
    }
};

