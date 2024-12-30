import React from 'react'
import { MDCFormField } from '@material/form-field'
import { MDCCheckbox } from '@material/checkbox'

import './index.css'

class Checkbox extends React.Component {
  ref = React.createRef()
  ffRef = React.createRef()

  state = {
    checkbox: null,
    ff: null,
    valid: null,
    validationMessage: null
  }

  componentDidMount() {
    const raw = this.ref.current
    const ffRaw = this.ffRef.current
    const checkbox = MDCCheckbox.attachTo(raw)
    let state = { checkbox }
    if (ffRaw) {
      const ff = MDCFormField.attachTo(ffRaw)
      ff.input = checkbox
      state = { ...state, ff }
    }
    const input = raw.querySelector('.mdc-checkbox__native-control')
    input.addEventListener('click', this.checkValidity)
    this.setState(state)
  }

  componentWillUnmount() {
    const { ff, checkbox } = this.state
    this.ref.current
      .querySelector('.mdc-checkbox__native-control')
      .removeEventListener('click', this.checkValidity)
    checkbox.destroy()
    if (ff) {
      ff.destroy()
    }
  }

  checkValidity = (e) => {
    const raw = this.ref.current
    const el = e.target
    this.setState({
      valid: el.validity.valid,
      validationMessage: el.validationMessage
    })
    if (el.validity.valid && raw.classList.contains('mdc-checkbox--invalid')) {
      raw.classList.remove('mdc-checkbox--invalid')
    } else if (
      !el.validity.valid &&
      !raw.classList.contains('mdc-checkbox--invalid')
    ) {
      raw.classList.add('mdc-checkbox--invalid')
    }
  }

  render() {
    const { valid, validationMessage } = this.state
    const {
      className,
      id,
      label,
      labelId,
      helper,
      disabled,
      outlined,
      trailingLabel,
      required,
      fullwidth,
      hideValidationMessage,
      hideHelperLine,
      noWrapper,
      ...rest
    } = this.props

    const cbId = id
      ? id
      : label
      ? 'cb-' + label.replace(/ /g, '-').toLowerCase()
      : null
    const idAttr = cbId ? { id: cbId } : {}
    const forAttr = label ? { htmlFor: cbId } : {}
    const disabledAttr = disabled ? { disabled: 'disabled' } : {}
    const requiredAttr = required ? { required: true } : {}
    const arialabeledAttr = labelId
      ? { 'aria-labelledby': labelId, tabIndex: -1 }
      : {}

    const Wrapper1Tag = noWrapper ? React.Fragment : 'div'
    const Wrapper1Attrs = noWrapper
      ? {}
      : { className: 'mdc-touch-target-wrapper' }
    const Wrapper2Tag = noWrapper ? React.Fragment : 'div'
    const Wrapper2Attrs = noWrapper
      ? {}
      : {
          ref: this.ffRef,
          className:
            'mdc-form-field' +
            (trailingLabel ? ' mdc-form-field--align-end' : '')
        }
    return (
      <Wrapper1Tag {...Wrapper1Attrs}>
        <Wrapper2Tag {...Wrapper2Attrs}>
          <div
            ref={this.ref}
            className={
              'mdc-checkbox mdc-checkbox--touch' +
              (disabled ? ' mdc-checkbox--disabled' : '') +
              (className ? ' ' + className : '')
            }
          >
            <input value="0" type="hidden" name="attribute" />
            <input
              {...idAttr}
              {...arialabeledAttr}
              {...disabledAttr}
              type="checkbox"
              className="mdc-checkbox__native-control"
              {...requiredAttr}
              {...rest}
            />
            <div className="mdc-checkbox__background">
              <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                <path
                  className="mdc-checkbox__checkmark__path mdc-checkbox__checkmark-path"
                  fill="none"
                  stroke="white"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"
                />
              </svg>
              <div className="mdc-checkbox__mixedmark" />
            </div>
            {!noWrapper ? <div className="mdc-checkbox__ripple" /> : null}
          </div>
          {!noWrapper ? <label {...forAttr}>{label}</label> : null}
        </Wrapper2Tag>
        {!noWrapper && !hideHelperLine ? (
          <div className="mdc-checkbox-helper-line">
            <div className="mdc-checkbox-helper-text" aria-hidden="true">
              {required && !hideValidationMessage && valid === false
                ? validationMessage
                : '\u00A0'}
            </div>
          </div>
        ) : null}
      </Wrapper1Tag>
    )
  }
}

export default Checkbox
