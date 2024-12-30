import React from 'react'

const Icon = (props) => {
	const { className, children, ...rest } = props
	return (
		<i className={ 'material-icons' + (className ? ' ' + className : '')} { ...rest }>{ children }</i>
	)
}

export default Icon
