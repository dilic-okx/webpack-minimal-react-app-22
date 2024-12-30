const appConfig = {
	theme: {
		nav: {
			label: 'xAdmin'
		},
		dark: true,
		fixed: true,
		showHeaderOnAuthRoutes: true,
		showInputIconsOnLogin: false,
		routesWithoutStaticHeader: [ '/item-details' ]
	},
	services: {},
	api: {},
	general: {
		clientName: 'Open Kinetix',
		appExitRoutes: [ '/', '/home', '/dashboard' ],
		authRoutes: [ '/login', '/register', '/reset-password' ],
		defaultCurrency: 'gbp',
		updateDateTimer: 20,
		debug: true
	},
	localization: {
		defaultLocale: 'en',
		supportedLocales: {
			'en': 'English',
			'fr': 'français'
		}
	},
	appType: {
		hasOrdering: true
	},
	configS3: {}
}

export const getConfig = () => appConfig
export const updateConfig = (newConfig) => ({ ...appConfig, ...newConfig })

export default appConfig
