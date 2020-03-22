import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	Renderer2,
	ViewChild
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import * as objectPath from 'object-path';
// Layout
import { MenuConfig } from '../../../core/_config/menu.config';
import { LayoutConfigService, MenuAsideService, MenuOptions, OffcanvasOptions } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { RequestDataService } from '../../../service/request-data.service';
import { PagesService } from '../../pages/pages.service';

@Component({
	selector: 'kt-aside-left',
	templateUrl: './aside-left.component.html',
	styleUrls: ['./aside-left.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent implements OnInit, AfterViewInit {

	@ViewChild('asideMenu', { static: true }) asideMenu: ElementRef;

	currentRouteUrl: string = '';
	insideTm: any;
	outsideTm: any;
	loadingMenu: boolean = false;
	noloadingtext: boolean = true;
	oto: string = "";
	initMenu: any = [];
	currentMenu: any = [];
	menuParent: any;

	menuCanvasOptions: OffcanvasOptions = {
		baseClass: 'kt-aside',
		overlay: true,
		closeBy: 'kt_aside_close_btn',
		toggleBy: {
			target: 'kt_aside_mobile_toggler',
			state: 'kt-header-mobile__toolbar-toggler--active'
		}
	};

	menuOptions: MenuOptions = {
		// vertical scroll
		scroll: null,

		// submenu setup
		submenu: {
			desktop: {
				// by default the menu mode set to accordion in desktop mode
				default: 'dropdown',
			},
			tablet: 'accordion', // menu set to accordion in tablet mode
			mobile: 'accordion' // menu set to accordion in mobile mode
		},

		// accordion setup
		accordion: {
			expandAll: false // allow having multiple expanded accordions in the menu
		}
	};

	/**
	 * Component Conctructor
	 *
	 * @param htmlClassService: HtmlClassService
	 * @param menuAsideService
	 * @param layoutConfigService: LayouConfigService
	 * @param router: Router
	 * @param render: Renderer2
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		public htmlClassService: HtmlClassService,
		public menuAsideService: MenuAsideService,
		public layoutConfigService: LayoutConfigService,
		private request: RequestDataService,
		private router: Router,
		private render: Renderer2,
		private cdr: ChangeDetectorRef,
		private pagesService: PagesService
	) {
	}

	ngAfterViewInit(): void {
		this.menuParent = document.getElementById("kt_aside_menu")
	}

	ngOnInit() {
		this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
				this.cdr.markForCheck();
			});

		const config = this.layoutConfigService.getConfig();

		if (objectPath.get(config, 'aside.menu.dropdown')) {
			this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
			// tslint:disable-next-line:max-line-length
			this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', objectPath.get(config, 'aside.menu.submenu.dropdown.hover-timeout'));
		}

		let x: any = [
			{
				title: 'Home',
				root: true,
				icon: 'flaticon2-architecture-and-city',
				page: '/home',
				meta_data: 'home'
			},
			{ section: 'Master' },
			{
				title: 'Daftar Bank',
				icon: 'flaticon2-layers',
				page: '/master/bank'
			},
			{
				title: 'Daftar Rekening Perusahaan',
				icon: 'flaticon2-layers',
				page: '/master/rekening-perusahaan'
			},
			{
				title: 'Pengaturan Daftar Akun',
				icon: 'flaticon2-layers',
				page: '/master/pengaturan-akun'
			},
			{
				title: 'Chart of Account',
				icon: 'flaticon2-layers',
				page: 'master/chart-of-account'
			},
			{
				title: 'Daftar Jenis Transaksi',
				icon: 'flaticon2-layers',
				page: 'master/jenis-transaksi'
			},
			{
				title: 'Pengaturan Saldo Awal',
				icon: 'flaticon2-layers',
				page: 'master/pengaturan-saldo-awal'
			},
			{ section: 'Transaksi' },
			{
				title: 'Jurnal Umum',
				icon: 'flaticon2-layers',
				page: 'transaksi/jurnal-umum'
			},
			{
				title: 'Posting Jurnal & Tutup Periode',
				icon: 'flaticon2-layers',
				page: 'transaksi/posting-jurnal-tutup-periode'
			},
			{ section: 'Monitoring' },
			{
				title: 'Transaksi Jurnal Per Periode',
				icon: 'flaticon2-layers',
				page: 'monitoring/transaksi-jurnal-per-periode'
			},
			{
				title: 'Saldo Akun Periode Aktif',
				icon: 'flaticon2-layers',
				page: 'monitoring/saldo-akun-periode-aktif'
			},

		]

		let menu = new MenuConfig()
		let side = menu.defaults
		side.aside.items = x
		this.menuAsideService.setMenu(side)


		// this.getOtoritas();
	}

	/**
	 * Check Menu is active
	 * @param item: any
	 */
	isMenuItemIsActive(item): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		return this.currentRouteUrl.indexOf(item.page) !== -1;
	}

	/**
	 * Check Menu Root Item is active
	 * @param item: any
	 */
	isMenuRootItemIsActive(item): boolean {
		let result: boolean = false;

		for (const subItem of item.submenu) {
			result = this.isMenuItemIsActive(subItem);
			if (result) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
	mouseEnter(e: Event) {
		// check if the left aside menu is fixed
		if (document.body.classList.contains('kt-aside--fixed')) {
			if (this.outsideTm) {
				clearTimeout(this.outsideTm);
				this.outsideTm = null;
			}

			this.insideTm = setTimeout(() => {
				// if the left aside menu is minimized
				if (document.body.classList.contains('kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
					// show the left aside menu
					this.render.removeClass(document.body, 'kt-aside--minimize');
					this.render.addClass(document.body, 'kt-aside--minimize-hover');
				}
			}, 50);
		}
	}

	/**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
	mouseLeave(e: Event) {
		if (document.body.classList.contains('kt-aside--fixed')) {
			if (this.insideTm) {
				clearTimeout(this.insideTm);
				this.insideTm = null;
			}

			this.outsideTm = setTimeout(() => {
				// if the left aside menu is expand
				if (document.body.classList.contains('kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
					// hide back the left aside menu
					this.render.removeClass(document.body, 'kt-aside--minimize-hover');
					this.render.addClass(document.body, 'kt-aside--minimize');
				}
			}, 100);
		}
	}

	getOtoritas() {
		this.request.apiData('otoritas', 'g-otoritas-user', { user_id: localStorage.getItem('user_id') }).subscribe(
			data => {
				if (data['STATUS'] === 'Y') {
					this.oto = data['RESULT'] == null ? "Otoritas tidak ditemukan" : data['RESULT']
					this.getMenuList(this.oto);
				}
			}
		)
	}

	getMenuList(ko) {
		this.request.apiData('otoritas', 'g-otoritas-menu', { kode_otoritas: ko }).subscribe(
			data => {
				if (data['STATUS'] === 'Y') {
					let menuData: Array<Object> = data['RESULT'],
						menuTitle = menuData.filter(x => x['detail'] === 'N').sort(this.compare),
						menuContent = menuData.filter(x => x['detail'] !== 'N' && x['detail'] != null).sort(this.compare);
					let x: any = [
						{
							title: 'Home',
							root: true,
							icon: 'flaticon2-architecture-and-city',
							page: '/home',
							meta_data: 'home'
						}
					]
					for (var i = 0; i < menuTitle.length; i++) {
						let tt = {
							section: menuTitle[i]['nama_menu'],
							meta_data: menuTitle[i]['nama_menu']
						}
						let indexSection = x.length
						x.push(tt)
						for (var j = 0; j < menuContent.length; j++) {
							if (menuContent[j]['induk_menu'] === menuTitle[i]['kode_menu']) {
								let tc = {
									title: menuContent[j]['nama_menu'],
									page: menuContent[j]['link_menu'],
									icon: menuContent[j]['img_menu'],
									meta_data: menuTitle[i]['nama_menu'] + " " + menuContent[j]['nama_menu']
								}
								x.push(tc)
								x[indexSection]['meta_data'] = x[indexSection]['meta_data'] + " " + menuContent[j]['nama_menu']
							}
						}

					}
					let menu = new MenuConfig()
					let side = menu.defaults
					side.aside.items = x
					this.menuAsideService.setMenu(side)
					this.loadingMenu = false
					this.cdr.markForCheck()
					this.checkMenuAllowed(x)
					this.pagesService.toggle(false)
					this.initMenu = JSON.parse(JSON.stringify(x))
					this.currentMenu = JSON.parse(JSON.stringify(x))
					setTimeout(() => {
						const classElement = document.getElementsByClassName('kt-menu__item--active');
						if (classElement.length > 0) {
							const el = classElement[0].getBoundingClientRect()
							const t = el.top
							const m = el.height / 2

							const sc = t + m
							const sy = sc - (window.innerHeight / 2)
							this.menuParent.scrollTo(0, sy)
						}
					}, 100);
				} else {
					// this.loadingMenu = false
					this.cdr.markForCheck()
					alert('Something is wrong, please try again later.')
				}
			}
		)
	}

	checkMenuAllowed(data: Array<Object>) {
		let allowed = false
		for (var i = 0; i < data.length; i++) {
			if (data[i]['page'] !== undefined || data[i]['page'] != null) {
				if (data[i]['page'] === this.currentRouteUrl) {
					allowed = true
					break;
				}
			}
		}

		if (!allowed) {
			this.router.navigateByUrl('/')
		}
	}

	compare(a, b) {
		// Use toUpperCase() to ignore character casing
		const genreA = a.urutan_menu;
		const genreB = b.urutan_menu;

		let comparison = 0;
		if (genreA > genreB) {
			comparison = 1;
		} else if (genreA < genreB) {
			comparison = -1;
		}
		return comparison;
	}


	/**
	 * Returns Submenu CSS Class Name
	 * @param item: any
	 */
	getItemCssClasses(item) {
		let classes = 'kt-menu__item';

		if (objectPath.get(item, 'submenu')) {
			classes += ' kt-menu__item--submenu';
		}

		if (!item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--active kt-menu__item--here';
		}

		if (item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--open kt-menu__item--here';
		}

		// custom class for menu item
		const customClass = objectPath.get(item, 'custom-class');
		if (customClass) {
			classes += ' ' + customClass;
		}

		if (objectPath.get(item, 'icon-only')) {
			classes += ' kt-menu__item--icon-only';
		}

		return classes;
	}

	getItemAttrSubmenuToggle(item) {
		let toggle = 'hover';
		if (objectPath.get(item, 'toggle') === 'click') {
			toggle = 'click';
		} else if (objectPath.get(item, 'submenu.type') === 'tabs') {
			toggle = 'tabs';
		} else {
			// submenu toggle default to 'hover'
		}

		return toggle;
	}

	disableScroll() {
		return this.layoutConfigService.getConfig('aside.menu.dropdown') || false;
	}
}
