export class MenuConfig {
	public defaults: any = {
		/* header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
				},
				{
					title: 'Components',
					root: true,
					alignment: 'left',
					toggle: 'click',
					submenu: [
						{
							title: 'Google Material',
							bullet: 'dot',
							icon: 'flaticon-interface-7',
							submenu: [
								{
									title: 'Form Controls',
									bullet: 'dot',
									submenu: [
										{
											title: 'Auto Complete',
											page: '/material/form-controls/autocomplete',
											permission: 'accessToECommerceModule'
										},
										{
											title: 'Checkbox',
											page: '/material/form-controls/checkbox'
										}
									]
								},
								{
									title: 'Navigation',
									bullet: 'dot',
									submenu: [
										{
											title: 'Menu',
											page: '/material/navigation/menu'
										},
										{
											title: 'Sidenav',
											page: '/material/navigation/sidenav'
										}
									]
								}
							]
						},
						{
							title: 'Ng-Bootstrap',
							bullet: 'dot',
							icon: 'flaticon-web',
							submenu: [
								{
									title: 'Accordion',
									page: '/ngbootstrap/accordion'
								},
								{
									title: 'Alert',
									page: '/ngbootstrap/alert'
								}
							]
						},
					]
				}
			]
		}, */
		aside: {
			self: {},
			items: [
				{
					title: 'Home',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/home'
				},
				{section: 'Management'},
				{
					title: 'Daftar Perusahaan',
					icon: 'flaticon2-group',
					page: '/master/perusahaan'
				},
				{
					title: 'Daftar Menu',
					icon: 'flaticon-grid-menu-v2',
					page: '/master/menu'
				},
				{
					title: 'User Otoritas',
					icon: 'flaticon2-user-1',
					page: '/master/user-otoritas'
				}
				/* {section: 'Components'},
				{
					title: 'Google Material',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-browser-2',
					submenu: [
						{
							title: 'Form Controls',
							bullet: 'dot',
							submenu: [
								{
									title: 'Auto Complete',
									page: '/material/form-controls/autocomplete',
									permission: 'accessToECommerceModule'
								},
								{
									title: 'Checkbox',
									page: '/material/form-controls/checkbox'
								}
							]
						},
						{
							title: 'Navigation',
							bullet: 'dot',
							submenu: [
								{
									title: 'Menu',
									page: '/material/navigation/menu'
								},
								{
									title: 'Sidenav',
									page: '/material/navigation/sidenav'
								}
							]
						}
					]
				},
				{
					title: 'Ng-Bootstrap',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-digital-marketing',
					submenu: [
						{
							title: 'Accordion',
							page: '/ngbootstrap/accordion'
						},
						{
							title: 'Alert',
							page: '/ngbootstrap/alert'
						}
					]
				}, */
				/* {section: 'Applications'},
				{
					title: 'eCommerce',
					bullet: 'dot',
					icon: 'flaticon2-list-2',
					root: true,
					permission: 'accessToECommerceModule',
					submenu: [
						{
							title: 'Customers',
							page: '/ecommerce/customers'
						},
						{
							title: 'Products',
							page: '/ecommerce/products'
						},
					]
				},
				{
					title: 'User Management',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-user-outline-symbol',
					submenu: [
						{
							title: 'Users',
							page: '/user-management/users'
						},
						{
							title: 'Roles',
							page: '/user-management/roles'
						}
					]
				} */
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
