import React from 'react'
import appConfig from '../.app-config'
import catalog from '../translation-catalog.json'

export const translate = (key, lang = null) => {
	return lang && catalog[key] && catalog[key][lang] ? catalog[key][lang] : key
}

const getUserLang = user => {
	return user && user.locale ? user.locale : appConfig.localization.defaultLocale
}

export const withTranslation = (WrappedComponent) => {
	class Translated extends React.Component {
		constructor(props) {
			super(props)
			this.__ = this.__.bind(this)
		}
		__(key){
			const { lang } = this.props
			return translate(key, lang)
		}
		render(){
			return <WrappedComponent __={ this.__ } { ...this.props }/>
		}
	}

	return Translated
}
