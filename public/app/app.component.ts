import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';

import {UrlService} from './url.service';
import {UrlFormComponent} from './url-form.component';

import './sass/style.scss';

@Component({
    selector: 'app',
    template: '<url-form></url-form>',
    providers: [
        HTTP_PROVIDERS,
        UrlService
    ],
    directives: [UrlFormComponent]
})
export class AppComponent { }
