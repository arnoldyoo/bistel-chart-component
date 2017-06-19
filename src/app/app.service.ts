/**
 * Created by airnold on 2017. 6. 19..
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ChartService {

    constructor(
        private http: Http
    ) { }

    getChartConfiguration(filename: string) {
        const url = `/src/app/chart-configuration/${filename}.json`;

    }

}
