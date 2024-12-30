import React from 'react'
import Layout from '../../components/layout'
import { withTranslation } from '../../lib/translate'

const Faq = ({ __ }) => {
	return (
		<Layout color="white" headerTitle={ __('Faq & Support') }>
			<h5>{ __('Faq & Support') }</h5>
			<p>{ __('Coming soon') }...</p>
		</Layout>
	)
}

export default withTranslation(Faq)
