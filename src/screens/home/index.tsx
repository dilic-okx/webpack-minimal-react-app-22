import React, { useState } from 'react'

import Layout from '../../components/layout'
import Button from '../../components/button'
import { Alert, Confirm, Modal } from '../../components/dialog'

import './index.css'

const Home = () => {
	const [alertOpen, setAlertOpen] = useState(false)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	return (
		<Layout label="Home">
			Home placeholder...
			<br/>
			<Button raised onClick={() => setAlertOpen(true)}>Test Alert</Button>
			<br/>
			<Button raised onClick={() => setConfirmOpen(true)}>Test Confirm</Button>
			<br/>
			<Button raised onClick={() => setModalOpen(true)}>Test Modal</Button>

			<Alert id="alert1" open={ alertOpen } onClose={() => setAlertOpen(false)}>Test Alert</Alert>
			<Confirm title="TiTLe" id="confirm1" open={ confirmOpen } onClose={() => setConfirmOpen(false)}>Test Confirm</Confirm>
			<Modal title="tiTLe" id="modal1" open={ modalOpen } onClose={() => setModalOpen(false)}>
				Test Modal
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
				<p>dfsdfdss</p>
			</Modal>
		</Layout>
	)
}

export default Home
