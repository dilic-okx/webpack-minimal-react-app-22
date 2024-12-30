import React, { useRef, useState, useEffect } from 'react'
import { MDCList } from '@material/list'
import { MDCRipple } from '@material/ripple'

require('./index.css')

export const ListItem = (props) => {
	const { className, role, selected, checked, activated, label, primary, secondary, icon, trailingIcon, htmlFor, children, ...rest } = props
	const selectedAttr = ['checkbox', 'radio'].indexOf(role) !== -1 ? {} : { 'aria-selected': selected ? 'true' : 'false' }
	const checkedAttr = { 'aria-checked': selected || checked ? 'true' : 'false' }
	const content = ['checkbox', 'radio'].indexOf(role) === -1 ? children : label || primary || '--'
	return (
		<li role={role || 'option'} className={'mdc-deprecated-list-item' + (selected ? ' mdc-deprecated-list-item--selected' : '') + (activated ? ' mdc-deprecated-list-item--activated' : '') + (className ? ' ' + className : '')} {...selectedAttr} {...checkedAttr} {...rest}>
			{ icon ? (
				<span className="mdc-deprecated-list-item__graphic material-icons" aria-hidden="true">{icon}</span>
			) : null}
			{['checkbox', 'radio'].indexOf(role) !== -1 ? (
				<span className="mdc-deprecated-list-item__graphic">{children}</span>
			) : null}
			{ htmlFor ? (
				<label className="mdc-deprecated-list-item__text" htmlFor={htmlFor}>
					{ secondary ? (
						<>
							<span className="mdc-deprecated-list-item__primary-text">{content}</span>
							<span className="mdc-deprecated-list-item__secondary-text">{secondary}</span>
						</>
					) : content}
				</label>
			) : (
					<span className="mdc-deprecated-list-item__text">
						{ secondary ? (
							<>
								<span className="mdc-deprecated-list-item__primary-text">{content}</span>
								<span className="mdc-deprecated-list-item__secondary-text">{secondary}</span>
							</>
						) : content}
					</span>
				)}
			{ trailingIcon ? (
				<span className="mdc-deprecated-list-item__meta material-icons" aria-hidden="true">{trailingIcon}</span>
			) : null}
		</li>
	)
}

export const ListItemForm = (props) => {
	const { className, ...rest } = props
	return (
		<ListItem className={'mdc-deprecated-list-item-form' + (className ? ' ' + className : '')} {...rest} />
	)
}

export const ListGroup = (props) => {
	const { className, title, children, ...rest } = props
	return (
		<div className={'mdc-deprecated-list-group' + (className ? ' ' + className : '')} {...rest}>
			{ title ? (
				<h3 className="mdc-deprecated-list-group__subheader">{title}</h3>
			) : null}
			{ children}
		</div>
	)
}

export const ListSeparator = (props) => {
	const { tag, className, ...rest } = props
	const Tag = tag || 'li' // allowed tag values ['li','hr']
	const roleAttr = Tag === 'li' ? { role: 'separator' } : {}
	return (
		<Tag {...roleAttr} className={'mdc-deprecated-list-divider' + (className ? ' ' + className : '')} {...rest} />
	)
}

const List = (props) => {
	const { className, role, twoLine, secondaryText, addFocusTrap, children, ...rest } = props
	const [list, setList] = useState(null)
	const ref = useRef(null)

	const setupList = () => {
		const raw = ref.current
		const lst = MDCList.attachTo(raw)
		lst.listElements.map((listItemEl) => MDCRipple.attachTo(listItemEl))
		if (['group', 'radiogroup'].indexOf(role) !== -1) {
			lst.singleSelection = true
		}
		setList(lst)
	}

	useEffect(() => {
		if (!list) {
			setupList()
		}
		return () => { if (list) { list.destroy() } }
	})

	if (list && role === 'listbox') {
		list.singleSelection = true
	}

	return (
		<ul ref={ref} role={role || 'list'} className={'mdc-deprecated-list' + (twoLine ? ' mdc-deprecated-list--two-line' : '') + (className ? ' ' + className : '')} {...rest}>
			{ addFocusTrap ? (
				<li className="focus-trap"><input /></li>
			) : null}
			{ children}
		</ul>
	)
}

export default List
