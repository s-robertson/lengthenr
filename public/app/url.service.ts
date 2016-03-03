import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

@Injectable()
export class UrlService {
    constructor(private http: Http) {}

    private _generateUrl = 'generate';

    lengthenUrl(url: string) {
        let body = JSON.stringify({ url });

        this.http.post(this._generateUrl, body)
            .map(res => res.json().data);
    }
}
