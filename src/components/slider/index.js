import React from 'react'
import  { MDCSlider } from '@material/slider'

import { withTranslation } from '../../lib/translate'

import './index.css'

class Slider extends React.Component {
	ref = React.createRef()

	state = {
		slider: null
	}

	componentDidMount() {
		const raw = this.ref.current
		const slider = MDCSlider.attachTo(raw)
		if (this.props.name){
			slider.listen('MDCSlider:change', this.updateSlider)
		}
		this.setState({ slider })
	}

	componentWillUnmount(){
		const { slider } = this.state
		if (this.props.name){
			slider.unlisten('MDCSlider:change', this.updateSlider)
		}
		slider.destroy()
	}

	updateSlider = () => {
		this.setState({ slider: this.state.slider })
	}

	render() {
		const { slider } = this.state
		const { __, dispatch, className, discrete, showMarkers, min, max, value, defaultValue, step, disabled, name, ...rest } = this.props
		const ariaLabel = this.props['aria-label'] || __('Select Value')
		const disabledAttr = disabled ? { 'aria-disabled': true } : {}
		return (
			<div ref={ this.ref } className={ 'mdc-slider' + (discrete ? ' mdc-slider--discrete' : '') + (showMarkers ? ' mdc-slider--display-markers' : '') + (className ? ' ' + className : '')} tabIndex="0" role="slider" aria-valuemin={ min || 0 } aria-valuemax={ max || 100 } aria-valuenow={ defaultValue || value || 0 } aria-label={ ariaLabel } data-step={ step || 1 } { ...disabledAttr } { ...rest }>
				<div className="mdc-slider__track-container">
					<div className="mdc-slider__track"/>
					{ showMarkers ? (
					<div className="mdc-slider__track-marker-container"/>
					) : null }
				</div>
				<div className="mdc-slider__thumb-container">
					{ discrete ? (
					<div className="mdc-slider__pin">
						<span className="mdc-slider__pin-value-marker"/>
					</div>
					) : null }
					<svg className="mdc-slider__thumb" width="21" height="21">
						<circle cx="10.5" cy="10.5" r="7.875"/>
					</svg>
					<div className="mdc-slider__focus-ring"/>
				</div>
				{ name ? (
					<div className="okx-slider__dom-hidden">
						<input alt={ slider ? slider.value : '' } className="okx-slider__dom-input" type="range" name={ name } min={ min || 0 } max={ max || 100 } value={ slider ? slider.value : '' } onChange={() => {}} { ...rest }/>
					</div>
				) : null }
			</div>
		)
	}
}

export default withTranslation(Slider)
