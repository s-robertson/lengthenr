import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class UrlService {
    constructor(private http: Http) {}

    private _generateUrl = 'http://localhost:8080/generate';

    lengthenUrl(url: string) {
        let body = JSON.stringify({ url });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._generateUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
