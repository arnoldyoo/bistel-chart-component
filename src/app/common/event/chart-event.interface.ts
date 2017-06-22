/**
 * Created by airnold on 2017. 6. 19..
 */

export interface IChartEvent {
    type: string;
    data: ChartEventData;
}

export class ChartEventData {
    event: any;
    data: any;

    constructor(event: any, data: any) {
        this.event = event;
        this.data = data;
    }
}
