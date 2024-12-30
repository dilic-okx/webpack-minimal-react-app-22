import React from 'react'
import { withTranslation } from '../../lib/translate'
import Layout from '../../components/layout'
import SimpleLoader from '../../components/simple-loader'

class Terms extends React.Component {
	render() {
		const { __ } = this.props
		return (
			<SimpleLoader>
				<Layout color="white" headerTitle={ __('Terms & Conditions') }>
					<h5>{ __('Terms & Conditions') }</h5>
					<p>{ __('Coming soon...')}</p>
				</Layout>
			</SimpleLoader>
		)
	}
}

export default withTranslation(Terms)
