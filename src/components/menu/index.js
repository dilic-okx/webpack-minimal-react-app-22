import React from 'react'
import { MDCMenu } from '@material/menu'

import Button from '../button'

import './index.css'

export const MenuItem = (props) => {
  const {
    className,
    selected,
    activated,
    disabled,
    label,
    primary,
    secondary,
    icon,
    trailingIcon,
    children,
    ...rest
  } = props
  const selectedAttr = { 'aria-selected': selected ? 'true' : 'false' }
  const content = children || label || primary || '--'
  return (
    <li
      role="menuitem"
      className={
        'mdc-deprecated-list-item' +
        (selected ? ' mdc-deprecated-list-item--selected' : '') +
        (activated ? ' mdc-deprecated-list-item--activated' : '') +
        (disabled ? ' mdc-deprecated-list-item--disabled' : '') +
        (className ? ' ' + className : '')
      }
      {...selectedAttr}
      {...rest}
    >
      {icon ? (
        <span
          className="mdc-deprecated-list-item__graphic material-icons"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <span className="mdc-deprecated-list-item__text">
        {secondary ? (
          <>
            <span className="mdc-deprecated-list-item__primary-text">
              {content}
            </span>
            <span className="mdc-deprecated-list-item__secondary-text">
              {secondary}
            </span>
          </>
        ) : (
          content
        )}
      </span>
      {trailingIcon ? (
        <span
          className="mdc-deprecated-list-item__meta material-icons"
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      ) : null}
    </li>
  )
}

export const MenuGroup = (props) => {
  const { children } = props
  return (
    <li>
      <ul className="mdc-menu__selection-group">{children}</ul>
    </li>
  )
}

export const MenuSeparator = () => (
  <li className="mdc-deprecated-list-divider" role="separator" />
)

class Menu extends React.Component {
  ref = React.createRef()

  state = {
    menu: null,
    open: !!this.props.open,
    coordinates: { x: null, y: null },
    selectedIndex: this.props.selected || this.props.selectedIndex || null
  }

  componentDidMount() {
    const raw = this.ref.current
    const menu = MDCMenu.attachTo(raw)
    menu.open = this.state.open
    menu.listen('MDCMenu:selected', this.onSelect)
    menu.listen('MDCMenuSurface:closed', this.onDismiss)
    if (this.props.context) {
      window.addEventListener('contextmenu', this.onContext)
    }
    this.setState({ menu })
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      const { menu } = this.state
      menu.open = this.props.open
      this.setState({ menu, open: this.props.open })
    }
  }

  onSelect = (args) => {
    const { detail } = args
    const { item, index } = detail
    if (item.classList.contains('mdc-deprecated-list-item--disabled')) {
      return false
    }
    const { menu } = this.state
    menu.open = false
    this.setState({ menu, open: false, selectedIndex: index })
    if (this.props.onSelect) {
      this.props.onSelect(index, item)
    }
  }

  onDismiss = () => {
    if (this.state.open) {
      const { menu } = this.state
      menu.open = false
      this.setState({ menu, open: false })
    }
    if (this.props.onDismiss) {
      this.props.onDismiss()
    }
  }

  toggleMenu = () => {
    const { menu } = this.state
    menu.open = !this.state.open
    this.setState({ menu, open: !this.state.open })
  }

  onContext = (e) => {
    const { menu } = this.state
    menu.open = !this.state.open
    menu.setAbsolutePosition(e.clientX, e.clientY)
    this.setState({
      menu,
      open: !this.state.open,
      coordinates: { x: e.clientX, y: e.clientY }
    })
    e.preventDefault()
  }

  render() {
    const { children, className, anchor, button, buttonProps } = this.props
    const { menu, open } = this.state
    const expandedAttr = menu && open ? { 'aria-expanded': true } : {}
    const WrapperTag = anchor ? 'div' : React.Fragment
    const wrapperAttributes = anchor
      ? { className: 'mdc-menu-surface--anchor' }
      : {}
    return (
      <WrapperTag {...wrapperAttributes}>
        {anchor && button ? (
          button
        ) : anchor && buttonProps ? (
          <Button
            onClick={this.toggleMenu}
            aria-haspopup={true}
            {...expandedAttr}
            {...(buttonProps || {})}
          />
        ) : null}
        <div
          ref={this.ref}
          className={
            'mdc-menu mdc-menu-surface' + (className ? ' ' + className : '')
          }
        >
          <ul
            className="mdc-deprecated-list"
            role="menu"
            aria-hidden="true"
            aria-orientation="vertical"
            tabIndex="-1"
          >
            {children}
          </ul>
        </div>
      </WrapperTag>
    )
  }
}

export default Menu
