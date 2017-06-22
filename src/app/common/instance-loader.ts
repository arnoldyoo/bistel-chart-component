import { DateTimeAxis, CategoryAxis, NumericAxis } from './component/axis/index';
import { ColumnSeries, LineSeries, ColumnSet, BarSeries, BarSet, PieSeries, PieSet } from './component/series/index';
import { AxisConfiguration, SeriesConfiguration } from './../model/index';
import { ChartException } from './error/index';

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
            LineSeries: LineSeries,
            BarSeries: BarSeries,
            BarSet: BarSet,
            PieSeries: PieSeries,
            PieSet: PieSet
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
        let classInstance: any;
        if (!ctor) {
            throw new ChartException(404, {message: `not found axis component ${name}`});
        }
        classInstance = new ctor(axisparams);
        return classInstance;
    }

    // name: string, config: any, target: any, margin: any
    seriesFactory(name: string, seriesparams: SeriesConfiguration): any {
        const ctor: any = this._getCtor(name);
        if (!ctor) {
            throw new ChartException(404, {message: `not found series component ${name}`});
        }
        let classInstance: any;
        classInstance = new ctor(seriesparams);
        return classInstance;
    }
};

