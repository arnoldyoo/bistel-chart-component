/**
 * Created by airnold on 2017. 6. 19..
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AppService {
    callcnt: number;
    constructor(
        private http: Http
    ) {
        this.callcnt = 0;
    }

    getChartConfiguration(filename: string): Observable<any> {
        this.callcnt++;
        const url = `/src/app/chart-configuration/${filename}.json`;
        return this.http.get(url).map( (res) => {
            return res.json();
        });
    }

}
