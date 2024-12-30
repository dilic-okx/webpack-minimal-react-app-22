import React from 'react'
import Select from './react-select'

import { withTranslation } from '../../lib/translate'

import './index.css'

class Reselect extends React.Component {
	render () {
		const { __, dispatch, className, outlined, label, value, defaultValue, options, multiple, ...rest } = this.props
		let selectedAttr = {}
		if ((defaultValue !== undefined || value !== undefined) && options){
			const val = defaultValue !== undefined ? defaultValue : value
			const key = defaultValue !== undefined ? 'defaultValue' : 'value'
			if (multiple && Array.isArray(val)){
				selectedAttr = {[key]: options.filter(o => val.includes(o.value))}
			}else{
				selectedAttr = {[key]: options.find(o => o.value === val)}
			}
		}
		const multiAttr = multiple ? { isMulti: true } : {}

		const deStyler = {
			option: (provided, state) => ({
				...provided,
				//borderBottom: '1px dotted pink',
				//color: state.isSelected ? 'red' : 'blue',
				backgroundColor: state.isSelected ? 'red' : null,
				//padding: 20,
			}),
			control: (provided) => ({
				...provided,
				content: '"' + provided.toString() + '"',
				borderRadius: undefined,
				borderWidth: undefined,
				borderColor: undefined,
				borderStyle: undefined,
				boxShadow: undefined,
				backgroundColor: undefined
			}),
			menu: (provided) => ({
				...provided,
				borderRadius: undefined
			})
			/*singleValue: (provided, state) => {
				const opacity = state.isDisabled ? 0.5 : 1;
				const transition = 'opacity 300ms';

				return { ...provided, opacity, transition };
			}*/
		}
		return (
			<div className={ 'okx-reselect' + (outlined ? ' okx-reselect-outlined' : '') + (multiple ? ' okx-reselect-multiple' : '') + (className ? ' ' + className : '')}>
				<Select styles={ deStyler } aria-labelledby="my-label-id" { ...selectedAttr } options={ options || []} { ...multiAttr } { ...rest }/>
				{ label ? (
				<span className="mdc-floating-label mdc-floating-label--float-above" id="my-label-id">{ label }</span>
				) : null }
			</div>
		)
	}
}

export default withTranslation(Reselect)
