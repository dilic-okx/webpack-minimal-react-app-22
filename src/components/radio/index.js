import React from 'react'
import { MDCFormField } from '@material/form-field'
import { MDCRadio } from '@material/radio'

import './index.css'

class Radio extends React.Component {
	ref = React.createRef()
	ffRef = React.createRef()

	state = {
		radio: null,
		ff: null
	}

	componentDidMount(){
		const raw = this.ref.current
		const ffRaw = this.ffRef.current
		const radio = MDCRadio.attachTo(raw)
		let state = { radio }
		if (ffRaw){
			const ff = MDCFormField.attachTo(ffRaw)
			ff.input = radio
			state = { ...state, ff }
		}
		this.setState(state)
	}

	componentWillUnmount(){
		const { ff, radio } = this.state
		radio.destroy()
		if (ff){
			ff.destroy()
		}
	}

	render (){
		const {
      className,
      id,
      label,
      labelId,
      helper,
      disabled,
      outlined,
      trailingLabel,
      fullwidth,
      noWrapper,
      hideHelperLine,
      ...rest
    } = this.props

		const rdId = id ? id : label ? 'rd-' + label.replace(/ /g, '-').toLowerCase() : null
		const idAttr = rdId ? { id: rdId } : {}
		const forAttr = label ? { htmlFor: rdId } : {}
		const disabledAttr = disabled ? { disabled: 'disabled' } : {}
		const arialabeledAttr = labelId ? { 'aria-labelledby': labelId, tabIndex: -1 } : {}

		const Wrapper1Tag = noWrapper ? React.Fragment : 'div'
		const Wrapper1Attrs = noWrapper ? {} : { className: 'mdc-touch-target-wrapper' }
		const Wrapper2Tag = noWrapper ? React.Fragment : 'div'
		const Wrapper2Attrs = noWrapper ? {} : { ref: this.ffRef, className: 'mdc-form-field' + (trailingLabel ? ' mdc-form-field--align-end' : '')}
		return (
      <Wrapper1Tag {...Wrapper1Attrs}>
        <Wrapper2Tag {...Wrapper2Attrs}>
          <div
            ref={this.ref}
            className={
              'mdc-radio' +
              (disabled ? ' mdc-radio--disabled' : '') +
              (className ? ' ' + className : '')
            }
          >
            <input
              {...idAttr}
              {...arialabeledAttr}
              {...disabledAttr}
              type="radio"
              className="mdc-radio__native-control"
              {...rest}
            />
            <div className="mdc-radio__background">
              <div className="mdc-radio__outer-circle" />
              <div className="mdc-radio__inner-circle" />
            </div>
            {!noWrapper ? <div className="mdc-radio__ripple" /> : null}
          </div>
          {!noWrapper ? <label {...forAttr}>{label}</label> : null}
        </Wrapper2Tag>
        {!noWrapper && !hideHelperLine ? (
          <div className="mdc-radio-helper-line">
            <div className="mdc-radio-helper-text" aria-hidden="true">
              &nbsp;
            </div>
          </div>
        ) : null}
      </Wrapper1Tag>
    )
	}
}

export default Radio
