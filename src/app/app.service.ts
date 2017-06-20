/**
 * Created by airnold on 2017. 6. 19..
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AppService {

    constructor(
        private http: Http
    ) { }

    getChartConfiguration(filename: string): Observable<any> {
        const url = `/src/app/chart-configuration/${filename}.json`;
        return this.http.get(url).map( (res) => {
            return res.json();
        });
    }

}
