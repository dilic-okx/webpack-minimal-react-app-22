import React from 'react'
import Layout from '../../components/layout'
import { withTranslation } from '../../lib/translate'

const Privacy = ({ __ }) => {
	return (
		<Layout color="white" headerTitle={ __('Privacy Policy') }>
			<h5>{ __('Privacy Policy') }</h5>
			<p>{ __('Coming soon') }...</p>
		</Layout>
	)
}

export default withTranslation(Privacy)
