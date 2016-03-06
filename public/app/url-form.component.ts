import {Component} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {UrlService} from './url.service';

@Component({
    selector: 'url-form',
    templateUrl: 'app/url-form.component.html'
})
export class UrlFormComponent {

    constructor(private _urlService: UrlService) {}

    lengthenedUrl = null;
    url = '';

    onSubmit() {
        this.lengthenUrl(this.url);
    }

    lengthenUrl(url: string) {
        url = this.checkUrl(url);

        this._urlService.lengthenUrl(url)
            .subscribe(
                url => this.lengthenedUrl = url.lengthened
            );
    }

    checkUrl(url: string): string {
        let checkedUrl = url;

        if (url.search(/http:\/\/|https:\/\//) != 0) {
            checkedUrl = 'http://' + checkedUrl;
        }

        return checkedUrl;
    }
}
