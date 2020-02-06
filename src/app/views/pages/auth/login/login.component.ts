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
	// Public params
	today: number = Date.now();
	loginForm: FormGroup;
	loading = false;
	hardLoading = true;
	errorType: any = null;
	failToLogin: boolean = false;
	appid: any = null;
	appData: any = null;

	private unsubscribe: Subject<any>;

	constructor(
		private fb: FormBuilder,
		private ref: ChangeDetectorRef,
		private route: ActivatedRoute,
		private request: RequestDataService
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit(): void {
		this.initLoginForm();

		this.route.queryParams.subscribe(params => {
			if (params['appid'] !== undefined && params['appid'] != null && params['appid'] !== '') {
				this.appid = params['appid']
			}
		})

		if (this.appid != null) {
			this.getAppInfo()
		} else {
			this.hardLoading = false
			this.ref.markForCheck()
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	initLoginForm() {
		this.loginForm = this.fb.group({
			user_id: [
				'',
				Validators.compose([
					Validators.required,
				])
			],
			user_password: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100)
				])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			user_id: controls['user_id'].value,
			user_password: controls['user_password'].value
		};
		this.request.authenticate('login', authData).subscribe(
			data => {
				if (data['STATUS'] === 'Y') {
					this.handleResponse(data['RESULT'])
				} else {
					this.failToLogin = true
					this.loading = false;
					this.ref.markForCheck();
				}
			}
		)
	}

	handleResponse(data) {
		if (data['token'] !== undefined || data['token'] != null || data['token'] !== '') {
			if (this.appid != null) {
				parent.localStorage.setItem('user_id', data['user_id'])
				parent.localStorage.setItem('token', data['token'])
				parent.window.location.href = "/"
			} else {
				localStorage.setItem('user_id', data['user_id'])
				localStorage.setItem('token', data['token'])
				window.location.href = "/"
			}
		}
		else
			alert('DATA YANG DIPERLUKAN TIDAK DITEMUKAN.')

	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	getAppInfo() {
		this.hardLoading = false;
		this.ref.markForCheck()
	}

	retryNow() {
		if (this.appid != null) {
			parent.window.location.reload()
		} else {
			window.location.reload()
		}
	}
}
