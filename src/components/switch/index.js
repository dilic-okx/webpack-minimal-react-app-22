import React from 'react'
import { MDCFormField } from '@material/form-field'
import  { MDCSwitch } from '@material/switch'

import { withTranslation } from '../../lib/translate'

import './index.css'

class Switch extends React.Component {
	ref = React.createRef()
	ffRef = React.createRef()

	state = {
		sw: null,
		ff: null,
		valid: null,
		validationMessage: null
	}

	componentDidMount() {
		const raw = this.ref.current
		const ffRaw = this.ffRef.current
		const sw = MDCSwitch.attachTo(raw)
		const ff = MDCFormField.attachTo(ffRaw)
		ff.input = sw
		const input = raw.querySelector('.mdc-switch__native-control')
		input.addEventListener('click', this.checkValidity)
		this.setState({ sw, ff })
	}

	componentWillUnmount(){
		const { ff, sw } = this.state
		this.ref.current.querySelector('.mdc-switch__native-control').removeEventListener('click', this.checkValidity)
		sw.destroy()
		ff.destroy()
	}

	checkValidity = (e) => {
		const raw = this.ref.current
		const el = e.target
		this.setState({ valid: el.validity.valid, validationMessage: el.validationMessage })
		if (el.validity.valid && raw.classList.contains('mdc-switch--invalid')){
			raw.classList.remove('mdc-switch--invalid')
		}else if (!el.validity.valid && !raw.classList.contains('mdc-switch--invalid')){
			raw.classList.add('mdc-switch--invalid')
		}
	}

	render() {
		const { valid, validationMessage } = this.state
		const { __, dispatch, className, id, label, labelId, checked, trailingLabel, required, disabled, hideValidationMessage, ...rest } = this.props

		const swId = id ? id : label ? 'sw-' + label.replace(/ /g, '-').toLowerCase() : null
		const idAttr = swId ? { id: swId } : {}
		const forAttr = label ? { htmlFor: swId } : {}
		const arialabeledAttr = labelId ? { 'aria-labelledby': labelId } : {}
		const disabledAttr = disabled ? { disabled: true } : {}
		const requiredAttr = required ? { required: true } : {}
		const checkedAttr = checked ? { checked: true } : {}
		return (
			<div className="mdc-touch-target-wrapper">
				<div ref={ this.ffRef } className={ 'mdc-form-field' + (trailingLabel ? ' mdc-form-field--align-end' : '')}>
					<div ref={ this.ref } className={ 'mdc-switch mdc-switch--touch' + (disabled ? ' mdc-switch--disabled' : '') + (checked ? ' mdc-switch--checked' : '') + (className ? ' ' + className : '')}>
						<div className="mdc-switch__track"/>
						<div className="mdc-switch__ripple"/>
						<div className="mdc-switch__thumb-underlay">
							<div className="mdc-switch__thumb"/>
							<input type="checkbox" { ...idAttr } { ...arialabeledAttr } className="mdc-switch__native-control" role="switch" aria-checked={ !!checked } { ...disabledAttr } { ...requiredAttr } { ...checkedAttr } { ...rest }/>
						</div>
					</div>
					<label { ...forAttr }>{ label }</label>
				</div>
				<div className="mdc-switch-helper-line">
					<div className="mdc-switch-helper-text" aria-hidden="true">{ required && !hideValidationMessage && valid === false ? validationMessage : '\u00A0' }</div>
				</div>
			</div>
		)
	}
}

export default withTranslation(Switch)
