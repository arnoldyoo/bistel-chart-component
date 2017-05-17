export interface SeriesConfiguration {
    condition: SeriesConditions;
    target?: any;
    margin: any;
};

export interface AxisConfiguration {
    conditions: AxisConditions;
    target?: any;
    margin: any;
    width: number;
    height: number;
    domain?: Array<any>;
    data?: Array<any>;
}

export interface AxisConditions {
    field: string;
    format: any;
    visible: boolean;
    title: string;
    type: string;
    orient: string;
    tickInfo?: any;
}

export interface SeriesConditions {
    xField: string;
    yField: string;
    displayName: string;
    visible: boolean;
}
