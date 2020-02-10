// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
		private ref: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
	}
}
