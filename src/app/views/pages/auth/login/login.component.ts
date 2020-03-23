// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
// RxJS
import { Observable, Subject } from 'rxjs';
import { RequestDataService } from '../../../../service/request-data.service';

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	
	appid: any = "";
	frameSource: any = "";

	constructor(
		private ref: ChangeDetectorRef,
		private sanitizer: DomSanitizer,
	) {
	}

	ngOnInit(): void {
		// this.frameSource = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:4201/auth/login?appid=bcad52ed12a9176fdc653ca776293fc8")
		window.addEventListener('message', function(e) {
			if (e.data['e_id'] === 'success_login') {
				localStorage.setItem('user_id', e.data['user_id'])
				localStorage.setItem('token', e.data['token'])
				window.location.href = "/"
			}
		})
	}

	ngOnDestroy(): void {
	}

	call() {
		window.parent.postMessage({
			'func': 'funct',
			'message': 'Msg'
		}, '*');
	}
}
