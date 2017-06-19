import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


///Service class to call REST API
@Injectable()
export class ChartConfigurationService {

    constructor(private http: Http) {
    }

    getConfiguration = (src): Observable<Response> => {
        console.log('In getConfiguration of Chart ConfigurationService');
        // 'app/component/chart/configurations/column-group.json'
        return this.http.get(src).map( (res) => {
            console.log('result : ', res.json());
            return res.json();
        });
    }
}
