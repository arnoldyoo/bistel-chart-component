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
            DateTimeAxis: DateTimeAxis
        };
    }

    factory( name: string, ...rest ) {
        const ctor: any = this.ctors[name];
        if (!ctor) {
            return null;
        }
        let newclass = new ctor(rest);
        console.log(newclass);
        return newclass;
    }
};

