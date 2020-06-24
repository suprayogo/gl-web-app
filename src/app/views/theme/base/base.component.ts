// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
// RxJS
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, MenuConfigService, PageConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { LayoutConfig } from '../../../core/_config/layout.config';
import { MenuConfig } from '../../../core/_config/menu.config';
import { PageConfig } from '../../../core/_config/page.config';
// User permissions
import { NgxPermissionsService } from 'ngx-permissions';
import { currentUserPermissions, Permission } from '../../../core/auth';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { ActivatedRoute } from '@angular/router';
import { AuthRequestService } from '../../../service/authentication/auth-request.service';
import { GlobalVariableService } from '../../../service/global-variable.service';

class HeightAndWidth {
	height: number;
	width: number;
}

@Component({
	selector: 'kt-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
	@ViewChild('divToTrackHeightChanges', { static: false }) divToTrackHeightChanges: ElementRef;
	//Width & Height Subscription
	height: number = 0;
	width: number = 0;
	hSub: Subscription;

	//Resize Listener
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.doDivHeightChange(this.getHeightAndWidthObject());
	}

	// Public variables
	selfLayout: string;
	asideDisplay: boolean;
	asideSecondary: boolean;
	subheaderDisplay: boolean;
	desktopHeaderDisplay: boolean;
	fitTop: boolean;
	fluid: boolean;
	loading: boolean = true;
	remoteAccess: boolean = false;
	fromIframe: boolean = true;

	// Private properties
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	private currentUserPermissions$: Observable<Permission[]>;


	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 * @param menuConfigService: MenuConfifService
	 * @param pageConfigService: PageConfigService
	 * @param htmlClassService: HtmlClassService
	 * @param store
	 * @param permissionsService
	 */
	constructor(
		//Utilities
		private ref: ChangeDetectorRef,
		private router: ActivatedRoute,
		//Layout Service
		private layoutConfigService: LayoutConfigService,
		private menuConfigService: MenuConfigService,
		private pageConfigService: PageConfigService,
		private htmlClassService: HtmlClassService,
		private store: Store<AppState>,
		private permissionsService: NgxPermissionsService,
		//Service Variable
		private gbl: GlobalVariableService,
		private auth: AuthRequestService,
	) {
		this.loadRolesWithPermissions();

		// register configs by demos
		this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
		this.menuConfigService.loadConfigs(new MenuConfig().configs);
		this.pageConfigService.loadConfigs(new PageConfig().configs);

		// setup element classes
		this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

		const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
			// reset body class based on global and page level layout config, refer to html-class.service.ts
			document.body.className = '';
			this.htmlClassService.setConfig(layoutConfig);
		});
		this.unsubscribe.push(subscr);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		if ( window.location === window.parent.location ) {
			this.fromIframe = false
			alert('Access Denied')
			return
		} else {
			let url = this.getDomain(document.referrer)
			// if (url !== "localhost") {
			// 	this.fromIframe = false
			// 	alert('Access Denied')
			// 	return
			// }
		}
		const config = this.layoutConfigService.getConfig();
		this.selfLayout = objectPath.get(config, 'self.layout');
		this.asideDisplay = objectPath.get(config, 'aside.self.display');
		this.subheaderDisplay = objectPath.get(config, 'subheader.display');
		this.desktopHeaderDisplay = objectPath.get(config, 'header.self.fixed.desktop');
		this.fitTop = objectPath.get(config, 'content.fit-top');
		this.fluid = objectPath.get(config, 'content.width') === 'fluid';

		// let the layout type change
		const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
			setTimeout(() => {
				this.selfLayout = objectPath.get(cfg, 'self.layout');
			});
		});
		this.unsubscribe.push(subscr);
		this.router.queryParams.subscribe(params => {
			params['remote'] === '1' ? this.remoteAccess = true : this.remoteAccess = false
			if (params['token'] && params['uid']) {
				this.gbl.getTokenDarkoCenter(params['token'], params['uid'])
				this.auth.manualValidation(params['token']).then(
					res => {
						if (res) {
							this.loading = false
							this.ref.markForCheck()
						}
					}
				)
			}
			if (params['kp'] && params['np']) {
				this.gbl.setPerusahaan(params['kp'], params['np'])
			}
			if (params['idp'] && ((params['tp'] && params['bp']) || params['tgp'])) {
				if (params['tgp']) {
					this.gbl.setPeriodeKasir(params['idp'], params['tgp'])
				} else {
					this.gbl.setPeriode(params['idp'], params['tp'], params['bp'])
				}
			}
		})
	}

	ngAfterViewInit(): void {
		this.setupHeightMutationObserver();
		this.doDivHeightChange(this.getHeightAndWidthObject());
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
		this.hSub.unsubscribe();
	}

	/**
	 * NGX Permissions, init roles
	 */
	loadRolesWithPermissions() {
		this.currentUserPermissions$ = this.store.pipe(select(currentUserPermissions));
		const subscr = this.currentUserPermissions$.subscribe(res => {
			if (!res || res.length === 0) {
				return;
			}

			this.permissionsService.flushPermissions();
			res.forEach((pm: Permission) => this.permissionsService.addPermission(pm.name));
		});
		this.unsubscribe.push(subscr);
	}

	//Resize Event Handler
	getHeightAndWidthObject(): HeightAndWidth {
		const newValues = new HeightAndWidth();
		newValues.height = this.divToTrackHeightChanges.nativeElement.offsetHeight;
		newValues.width = this.divToTrackHeightChanges.nativeElement.offsetWidth;
		return newValues;
	}

	doDivHeightChange(newValues: HeightAndWidth) {
		this.height = newValues.height;
		this.width = newValues.width;
		window.parent.postMessage({
			'type': 'RESIZE',
			'res': newValues
		}, "*")
	}

	setupHeightMutationObserver() {
		const observerable$ = new Observable<HeightAndWidth>(observer => {
			// Callback function to execute when mutations are observed
			// this can and will be called very often
			const callback = (mutationsList, observer2) => {
				observer.next(this.getHeightAndWidthObject());
			};
			// Create an observer instance linked to the callback function
			const elementObserver = new MutationObserver(callback);

			// Options for the observer (which mutations to observe)
			const config = { attributes: true, childList: true, subtree: true };
			// Start observing the target node for configured mutations
			elementObserver.observe(this.divToTrackHeightChanges.nativeElement, config);
		});

		this.hSub = observerable$
			.pipe(
				debounceTime(50),//wait until 50 milliseconds have lapsed since the observable was last sent
				distinctUntilChanged()//if the value hasn't changed, don't continue
			)
			.subscribe((newValues => {
				this.doDivHeightChange(newValues);
			}));
	}

	getDomain(url) {
		var prefix = /^https?:\/\//i;
		var domain = /^[^\/:]+/;
		// remove any prefix
		url = url.replace(prefix, "");
		// assume any URL that starts with a / is on the current page's domain
		if (url.charAt(0) === "/") {
			url = window.location.hostname + url;
		}
		// now extract just the domain
		var match = url.match(domain);
		if (match) {
			return(match[0]);
		}
		return(null);
	}
}
