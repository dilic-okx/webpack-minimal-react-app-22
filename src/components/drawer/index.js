import React from 'react'
import { MDCDrawer } from '@material/drawer'

require('./index.css')

export const DrawerHeader = (props) => <div className="mdc-drawer__header" {...props} />
export const DrawerTitle = (props) => <div className="mdc-drawer__title" {...props} />
export const DrawerSubtitle = (props) => <div className="mdc-drawer__subtitle" {...props} />
export const DrawerContent = (props) => <div className="mdc-drawer__content" {...props} />

class Drawer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			drawer: null
		}
	}
	componentDidMount() {
		if (!this.state.drawer) {
			this.setState({ drawer: MDCDrawer.attachTo(document.querySelector('.mdc-drawer')) })
		}
		if (this.props.onClose && document) {
			document.body.addEventListener('MDCDrawer:closed', this.props.onClose)
		}
	}
	componentWillUnmount() {
		if (this.props.onClose && document) {
			document.body.removeEventListener('MDCDrawer:closed', this.props.onClose)
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.open !== prevProps.open) {
			const drawer = this.state.drawer
			drawer.open = this.props.open
		}
	}
	render() {
		const { children } = this.props
		return (
			<>
				<aside className="mdc-drawer mdc-drawer--modal">
					{children}
				</aside>
				<div className="mdc-drawer-scrim" />
			</>
		)
	}
}

export default Drawer
