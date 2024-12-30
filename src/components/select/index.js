import React from 'react'
import { MDCSelect } from '@material/select'

import './index.css'

export const Option = (props) => {
  const { label, value, disabled, selected } = props
  const disabledAttr = disabled ? { disabled: 'disabled' } : {}
  const ariadisabledAttr = disabled ? { 'aria-disabled': true } : {}
  const roleAttr = disabled ? {} : { role: 'option' }
  const ariaselectedAttr = disabled ? {} : { 'aria-selected': !!selected }
  const datavalueAttr = disabled ? {} : { 'data-value': value || '' }
  return (
    <li
      {...disabledAttr}
      {...ariadisabledAttr}
      className={
        'mdc-deprecated-list-item' +
        (!disabled && selected ? ' mdc-deprecated-list-item--selected' : '') +
        (disabled ? ' mdc-deprecated-list-item--disabled' : '')
      }
      {...datavalueAttr}
      {...roleAttr}
      {...ariaselectedAttr}
    >
      <span className="mdc-deprecated-list-item__text">
        {label || value || ''}
      </span>
    </li>
  )
}

const validationMessages = {
  required: 'Please select a value if you want to proceed.',
  invalid: 'Selected value is invalid.'
}

const dd = (
  <span className="mdc-select__dropdown-icon">
    <svg
      className="mdc-select__dropdown-icon-graphic"
      viewBox="7 10 10 5"
      focusable="false"
    >
      <polygon
        className="mdc-select__dropdown-icon-inactive"
        stroke="none"
        fillRule="evenodd"
        points="7 10 12 15 17 10"
      ></polygon>
      <polygon
        className="mdc-select__dropdown-icon-active"
        stroke="none"
        fillRule="evenodd"
        points="7 15 12 10 17 15"
      ></polygon>
    </svg>
  </span>
)

class Select extends React.Component {
  ref = React.createRef()

  state = {
    select: null,
    valid: null,
    validationMessage: null
  }

  componentDidMount() {
    const raw = this.ref.current
    const select = MDCSelect.attachTo(raw)
    if (this.props.disabled) {
      select.disabled = true
    }
    if (this.props.required) {
      select.required = true
    }
    if (this.props.defaultValue || this.props.value) {
      select.value = this.props.defaultValue || this.props.value
    }
    const el = raw.querySelector('.mdc-select__selected-text')
    select.listen('MDCSelect:change', this.checkValidity)
    if (this.props.onChange) {
      select.listen('MDCSelect:change', () => this.props.onChange(select.value))
    }
    el.addEventListener('blur', this.checkValidity)
    this.setState({ select })
  }

  componentWillUnmount() {
    const { select } = this.state
    select.unlisten('MDCSelect:change', this.checkValidity)
    if (this.props.onChange) {
      select.unlisten('MDCSelect:change', () =>
        this.props.onChange(select.value)
      )
    }
    this.ref.current
      .querySelector('.mdc-select__selected-text')
      .removeEventListener('blur', this.checkValidity)
    select.destroy()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.disabled !== prevProps.disabled ||
      this.props.required !== prevProps.required
    ) {
      const { select } = this.state
      if (this.props.disabled !== prevProps.disabled) {
        select.disabled = !!this.props.disabled
      }
      if (this.props.required !== prevProps.required) {
        select.required = !!this.props.required
      }
      this.setState({ select })
    }
  }

  checkValidity = () => {
    const { select } = this.state
    if (!select.valid) {
      let validationMessage
      if (select.required && select.value === '') {
        validationMessage = validationMessages.required
      } else {
        validationMessage = validationMessages.invalid
      }
      this.setState({
        valid: false,
        validationMessage
      })
    } else {
      this.setState({
        valid: true,
        validationMessage: null
      })
    }
  }

  render() {
    const { select, valid, validationMessage } = this.state
    const {
      className,
      name,
      label,
      icon,
      helper,
      required,
      disabled,
      noHelperText,
      hideValidationMessage,
      outlined,
      fullwidth,
      children,
      ...rest
    } = this.props

    const baseId = label
      ? label.replace(/ /g, '-').toLowerCase()
      : Math.floor(Math.random() * 1000 + 1)
    const labelId = label ? 'label-' + baseId + '-select' : null
    const labelIdAttr = label ? { id: labelId } : {}
    const arialabeledAttr = label ? { 'aria-labelledby': labelId } : {}
    const ariadisabledAttr = disabled ? { 'aria-disabled': true } : {}
    const requiredAttr = required ? { required: true } : {}
    const ariarequiredAttr = required ? { 'aria-required': true } : {}
    return (
      <>
        <div
          ref={this.ref}
          className={
            'mdc-select' +
            (outlined ? ' mdc-select--outlined' : ' mdc-select--filled') +
            (disabled ? ' mdc-select--disabled' : '') +
            (required ? ' mdc-select--required' : '') +
            (!label ? ' mdc-select--no-label' : '') +
            (icon ? ' mdc-select--with-leading-icon' : '') +
            (fullwidth ? ' okx-select--fullwidth mdc-select--fullwidth' : '') +
            (className ? ' ' + className : '')
          }
          {...rest}
        >
          <div
            className="mdc-select__anchor"
            {...(disabled ? { 'aria-disabled': true } : {})}
          >
            {icon ? (
              <i
                className="material-icons mdc-select__icon"
                tabIndex="0"
                role="button"
              >
                {icon}
              </i>
            ) : null}
            {outlined ? (
              <span className="mdc-notched-outline">
                <span className="mdc-notched-outline__leading" />
                {label ? (
                  <span className="mdc-notched-outline__notch">
                    <span {...labelIdAttr} className="mdc-floating-label">
                      {label}
                    </span>
                  </span>
                ) : null}
                <span className="mdc-notched-outline__trailing" />
              </span>
            ) : (
              <>
                <span className="mdc-select__ripple" />
                {label ? (
                  <span
                    {...labelIdAttr}
                    className="mdc-floating-label mdc-floating-label--float-above"
                  >
                    {label}
                  </span>
                ) : null}
                <span className="mdc-line-ripple" />
              </>
            )}
            <span className="mdc-select__selected-text-container">
              <span
                className="mdc-select__selected-text"
                role="button"
                aria-haspopup="listbox"
                {...arialabeledAttr}
                {...ariadisabledAttr}
                {...ariarequiredAttr}
              />
            </span>
            {dd}
          </div>

          <div
            className="mdc-select__menu mdc-menu mdc-menu-surface"
            role="listbox"
          >
            <ul className="mdc-deprecated-list">{children}</ul>
          </div>
        </div>

        {!noHelperText ? (
          <div
            className={
              'mdc-select-helper-text' +
              (valid === false ? ' mdc-select-helper-text--validation-msg' : '')
            }
            aria-hidden="true"
          >
            {!hideValidationMessage && valid === false
              ? validationMessage
              : helper
              ? helper
              : '\u00A0'}
          </div>
        ) : null}
        {name ? (
          <div className="okx-select__dom-hidden">
            <input
              className="okx-select__dom-input"
              type="text"
              name={name}
              defaultValue={select ? select.value : ''}
              {...requiredAttr}
            />
          </div>
        ) : null}
      </>
    )
  }
}

export default Select
