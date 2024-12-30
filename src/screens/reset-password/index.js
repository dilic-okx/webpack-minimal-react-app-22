import React from 'react'

import Layout from '../../components/layout'
import { withTranslation } from '../../lib/translate'
import SimpleLoader from '../../components/simple-loader'

import './index.css'

class ResetPassword extends React.Component {
	render() {
		const { __ } = this.props
		return (
			<SimpleLoader>
				<Layout color="white" headerTitle={ __('Reset Password') }>
					<h5>{ __('Reset Password') }</h5>
					<p>{ __('Coming soon...')}</p>
				</Layout>
			</SimpleLoader>
		)
	}
}

export default withTranslation(ResetPassword)
