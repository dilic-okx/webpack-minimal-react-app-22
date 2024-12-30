import React, { useState, useEffect } from 'react'
import { MDCDialog } from '@material/dialog'

require('./index.css')

const Dialog = (props) => {
	const { id, mode, title, cancelLabel, confirmLabel, children, open, className } = props
	const dialogMode = mode || 'alert'
	const [dialog, setDialog] = useState(null)

	const setupDialog = () => {
		const selector = props.id ? '#' + props.id : '.mdc-dialog'
		if (document.querySelector(selector)) {
			const dlg = MDCDialog.attachTo(document.querySelector(selector))
			if (props.onClose) {
				dlg.listen('MDCDialog:closed', props.onClose)
			}
			setDialog(dlg)
		} else {
			setTimeout(setupDialog, 200)
		}
	}

	useEffect(() => {
		if (!dialog) {
			setupDialog()
		}
	})

	useEffect(() => {
		if (dialog) {
			if (open) {
				dialog.open()
			} else {
				dialog.close()
			}
		}
	}, [open]);

	return (
		<div id={id} className={'mdc-dialog' + (className ? ' ' + className : '')}>
			<div className="mdc-dialog__container">
				<div className="mdc-dialog__surface"
					role="alertdialog"
					aria-modal={['modal', 'confirm'].indexOf(dialogMode) !== -1}>
					{title ? (
						<h2 className="mdc-dialog__title">{title}</h2>
					) : null}
					{children ? (
						<div className="mdc-dialog__content">{children}</div>
					) : null}
					<footer className="mdc-dialog__actions">
						{dialogMode === 'confirm' ? (
							<>
								<button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
									<div className="mdc-button__ripple"></div>
									<span className="mdc-button__label">{cancelLabel || 'Cancel'}</span>
								</button>
								<button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept" data-mdc-dialog-button-default data-mdc-dialog-initial-focus>
									<div className="mdc-button__ripple"></div>
									<span className="mdc-button__label">{confirmLabel || 'OK'}</span>
								</button>
							</>
						) : (
								<button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
									<div className="mdc-button__ripple"></div>
									<span className="mdc-button__label">{confirmLabel || cancelLabel || 'OK'}</span>
								</button>
							)}
					</footer>
				</div>
			</div>
			{['modal', 'confirm'].indexOf(dialogMode) !== -1 ? (
				<div className="mdc-dialog__scrim" />
			) : null}
		</div>
	)
}

export const Alert = (props) => {
	return (
		<Dialog{...props} mode="alert" />
	)
}

export const Confirm = (props) => {
	return (
		<Dialog{...props} mode="confirm" />
	)
}

export const Modal = (props) => {
	return (
		<Dialog{...props} mode="modal" />
	)
}

export default Dialog
