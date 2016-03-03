import {Component} from 'angular2/core';
import {NgForm}    from 'angular2/common';

@Component({
    selector: 'url-form',
    templateUrl: 'public/app/url-form.component.html'
})
export class UrlFormComponent {

    submitted = false;

    url = '';

    onSubmit() {
        this.submitted = true;
    }
}
