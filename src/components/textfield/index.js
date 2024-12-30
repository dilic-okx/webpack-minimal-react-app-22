import React from 'react'
import { MDCTextField } from '@material/textfield'
import './index.css'

class Textfield extends React.Component {
  ref = React.createRef()

  state = {
    textfield: null,
    valid: null,
    validationMessage: null
  }

  componentDidMount() {
    const raw = this.ref.current
    const textfield = MDCTextField.attachTo(raw)
    const input = raw.querySelector('.mdc-text-field__input')
    input.addEventListener('keyup', this.checkValidity)
    this.setState({ textfield })
  }

  componentWillUnmount() {
    const { textfield } = this.state
    this.ref.current
      .querySelector('.mdc-text-field__input')
      .removeEventListener('keyup', this.checkValidity)
    textfield.destroy()
  }

  getValue = () => {
    return this.state.textfield ? this.state.textfield.value : ''
  }

  get value() {
    return this.state.textfield ? this.state.textfield.value : ''
  }

  checkValidity = (e) => {
    const el = e.target
    const raw = this.ref.current
    this.setState({
      valid: el.validity.valid,
      validationMessage: el.validationMessage
    })
    if (
      el.validity.valid &&
      raw.classList.contains('mdc-text-field--invalid')
    ) {
      raw.classList.remove('mdc-text-field--invalid')
    } else if (
      !el.validity.valid &&
      !raw.classList.contains('mdc-text-field--invalid')
    ) {
      raw.classList.add('mdc-text-field--invalid')
    }
  }

  render() {
    const { valid, validationMessage } = this.state
    const {
      type,
      className,
      label,
      icon,
      trailingIcon,
      helper,
      rows,
      cols,
      disabled,
      outlined,
      maxLength,
      showCounter,
      fullwidth,
      ...rest
    } = this.props

    const labelId = label
      ? 'label-' +
        label.replace(/ /g, '-').toLowerCase() +
        '-' +
        (type || 'text')
      : null
    const labelIdAttr = label ? { id: labelId } : {}
    const arialabeledAttr = label ? { 'aria-labelledby': labelId } : {}
    const helperId = helper
      ? 'helper-' +
        (label
          ? label.replace(/ /g, '-').toLowerCase()
          : Math.floor(Math.random() * 1000 + 1))
      : null
    const helperAttr = helper
      ? { 'aria-controls': helperId, 'aria-describedby': helperId }
      : {}
    const disabledAttr = disabled ? { disabled: 'disabled' } : {}
    const showCnt = maxLength && showCounter
    const maxLengthAttr = maxLength ? { maxLength } : {}

    return (
      <>
        <label
          ref={this.ref}
          className={
            'mdc-text-field' +
            (type === 'textarea' ? ' mdc-text-field--textarea' : '') +
            (disabled ? ' mdc-text-field--disabled' : '') +
            (outlined
              ? ' mdc-text-field--outlined'
              : ' mdc-text-field--filled') +
            (!label ? ' mdc-text-field--no-label' : '') +
            (fullwidth ? ' okx-text-field--fullwidth' : '') +
            (icon && type !== 'textarea'
              ? ' mdc-text-field--with-leading-icon'
              : '') +
            (trailingIcon && type !== 'textarea'
              ? ' mdc-text-field--with-trailing-icon'
              : '')
          }
        >
          {icon && type !== 'textarea' ? (
            <i
              className="material-icons mdc-text-field__icon mdc-text-field__icon--leading"
              tabIndex="0"
              role="button"
            >
              {icon}
            </i>
          ) : null}
          {outlined ? (
            <>
              {type === 'textarea' ? (
                <>
                  {showCnt ? (
                    <div className="mdc-text-field-character-counter" />
                  ) : null}
                  <textarea
                    className="mdc-text-field__input"
                    {...disabledAttr}
                    {...maxLengthAttr}
                    {...arialabeledAttr}
                    {...helperAttr}
                    rows={rows || 2}
                    cols={cols || 40}
                    {...rest}
                  />
                </>
              ) : (
                <>
                  <input
                    className="mdc-text-field__input"
                    type={type || 'text '}
                    {...disabledAttr}
                    {...maxLengthAttr}
                    {...arialabeledAttr}
                    {...helperAttr}
                    {...rest}
                  />
                  {trailingIcon ? (
                    <i
                      className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                      tabIndex="0"
                      role="button"
                    >
                      {trailingIcon}
                    </i>
                  ) : null}
                </>
              )}
              <span className="mdc-notched-outline">
                <span className="mdc-notched-outline__leading" />
                {label ? (
                  <span className="mdc-notched-outline__notch">
                    <label className="mdc-floating-label" {...labelIdAttr}>
                      {label}
                    </label>
                  </span>
                ) : null}
                <span className="mdc-notched-outline__trailing" />
              </span>
            </>
          ) : (
            <>
              <span className="mdc-text-field__ripple"></span>
              {label ? (
                <span className="mdc-floating-label" {...labelIdAttr}>
                  {label}
                </span>
              ) : null}
              {type === 'textarea' ? (
                <>
                  {showCnt ? (
                    <div className="mdc-text-field-character-counter" />
                  ) : null}
                  <textarea
                    className="mdc-text-field__input"
                    {...disabledAttr}
                    {...maxLengthAttr}
                    {...arialabeledAttr}
                    {...helperAttr}
                    rows={rows || 2}
                    cols={cols || 40}
                    {...rest}
                  />
                </>
              ) : (
                <>
                  <input
                    className="mdc-text-field__input"
                    type={type || 'text '}
                    {...disabledAttr}
                    {...maxLengthAttr}
                    {...arialabeledAttr}
                    {...helperAttr}
                    {...rest}
                  />
                  {trailingIcon ? (
                    <i
                      className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                      tabIndex="0"
                      role="button"
                    >
                      {trailingIcon}
                    </i>
                  ) : null}
                </>
              )}
              <span className="mdc-line-ripple"></span>
            </>
          )}
        </label>
        {!valid || helper || (type !== 'textarea' && showCnt) ? (
          <div className="mdc-text-field-helper-line">
            {!valid ? (
              <div
                className="mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg"
                id={helperId}
                aria-hidden="true"
              >
                {validationMessage}
              </div>
            ) : helper ? (
              <div
                className="mdc-text-field-helper-text"
                id={helperId}
                aria-hidden="true"
              >
                {helper}
              </div>
            ) : null}
            {type !== 'textarea' && showCnt ? (
              <div className="mdc-text-field-character-counter" />
            ) : null}
          </div>
        ) : null}
      </>
    )
  }
}

export default Textfield
