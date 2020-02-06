// Angular
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	//user$: Observable<User>;
	user_name = ""
	user_id = ""

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(
		private router: Router
	) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		//this.user$ = this.store.pipe(select(currentUser));
		this.user_name = localStorage.getItem('user_name')
		this.user_id = localStorage.getItem('user_id')
	}

	/**
	 * Log out
	 */
	logout() {
		localStorage.clear()
		this.router.navigateByUrl("/auth/login")
	}
}
