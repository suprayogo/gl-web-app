export class PageConfig {
	public defaults: any = {
		home: {
			page: {
				'title': 'Home',
				'desc': 'Welcome to Darko Center'
			},
		},
		'user-management': {
			aplikasi: {
				page: {
					title: 'Aplikasi',
					desc: ''
				}
			},
			user: {
				page: {
					title: 'User',
					desc: ''
				}
			}
		}
	};

	public get configs(): any {
		return this.defaults;
	}
}
