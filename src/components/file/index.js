import React from 'react'

import { withTranslation } from '../../lib/translate'

import './index.css'

class File extends React.Component {
	ref = React.createRef()
	state = {
		input: null
	}

	componentDidMount () {
		const input = this.ref.current
		input.addEventListener('change', this.handleChange)
		this.setState({ input })
	}

	componentWillUnmount () {
		const input = this.ref.current
		input.removeEventListener('change', this.handleChange)
		this.setState({ input: null })
	}

	handleChange = (e) => {
		const input = e.target
		const label = input.nextElementSibling
		const labelText = label.querySelector('.mdc-button__label')
		const labelVal = label.innerHTML
		let info
		if (input.multiple && input.files && input.files.length > 1) {
			info = input.getAttribute('data-multiple-info').replace('##cnt##', input.files.length)
		}else{
			info = input.value.split('\\').pop()
		}
		if (info) {
			labelText.innerHTML = info
		}else{
			labelText.innerHTML = labelVal
		}
	}

	render () {
		const { __, dispatch, id, multiple, label, ...rest } = this.props
		const inputId = id || 'file-input-' + Math.floor((Math.random() * 1000) + 1)
		const multipleAttr = multiple ? { multiple: true, 'data-multiple-info': '##cnt## files selected' } : {}
		return (
			<>
			<input ref={ this.ref } type="file" id={ inputId } { ...multipleAttr } { ...rest }/>
			<label className="mdc-button" htmlFor={ inputId }>
				<div className="mdc-button__ripple"/>
				<i className="material-icons mdc-button__icon" aria-hidden="true">cloud_upload</i>
				<span className="mdc-button__label">{ __(label || (multiple ? 'choose files' : 'choose a file'))}</span>
			</label>
			</>
		)
	}
}

export default withTranslation(File)
