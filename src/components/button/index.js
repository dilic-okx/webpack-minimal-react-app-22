import React, { useEffect } from 'react'
import { MDCRipple } from '@material/ripple'

require('./index.css')

const Button = (props) => {
	useEffect(() => {
		MDCRipple.attachTo(document.querySelector('.mdc-button'))
	})
	const { children, className, label, icon, trailingIcon, outlined, raised, unelevated, ...rest } = props
	const variantCss = '' + (outlined ? ' mdc-button--outlined' : '') + (raised ? ' mdc-button--raised' : '') + (unelevated ? ' mdc-button--unelevated' : '')
	return (
		<>
			<button className={'mdc-button' + variantCss + (className ? ' ' + className : '')} {...rest}>
				<div className="mdc-button__ripple"></div>
				{icon ? (<i className="material-icons mdc-button__icon" aria-hidden="true">{icon}</i>) : null}
				{label ? (<span className="mdc-button__label">{label}</span>) : null}
				{children}
				{trailingIcon ? (<i className="material-icons mdc-button__icon" aria-hidden="true">{trailingIcon}</i>) : null}
			</button>
		</>
	)
}

export default Button
