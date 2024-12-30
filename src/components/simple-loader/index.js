import React from 'react'
import Icon from '../icon'
require('./index.css')

export default ({ loading, children, transparent, loadingMessage, className }) => {
	return (
		<>
			{ loading ?
				<>
					<div className={'simple-loader' + (transparent ? ' transparent-loader' : '') + (className ? ' ' + className : '')}>
						<Icon>cached</Icon>
						{loadingMessage ? (
							<div className="simple-loader-message">{loadingMessage}</div>
						) : null}
					</div>
					{ children}
				</>
				: children
			}
		</>
	)
}
