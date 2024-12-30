import React, { useState } from 'react'
import ReactDatepicker from 'react-datepicker'
/*import ReactDatepicker, {
  registerLocale,
  setDefaultLocale
} from 'react-datepicker'
import { de, srLatn } from 'date-fns/locale'

registerLocale('de', de)
registerLocale('sr', srLatn)*/

import './index.css'

const DatePicker = (props) => {
  const { label, outlined, icon, trailingIcon, fullwidth, defaultValue } = props
  const isValidDate = (date) =>
    new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))
  const [startDate, setStartDate] = useState(
    defaultValue && isValidDate(defaultValue) ? new Date(defaultValue) : null
  )
  const timeFormat = props.timeFormat || 'HH:mm'
  const dateFormat =
    (props.dateFormat || 'dd.MM.yyyy.') +
    (props.showTimeSelect ? ' ' + timeFormat : '')
  const placaholder = props.placaholder || dateFormat
  const name = props.name || 'unset'
  const nameFormatted = name + '_formatted'
  return (
    <>
      <div
        className={
          'okx-element-wrapper' +
          (outlined ? ' okx-element-wrapper--outlined' : '') +
          (fullwidth ? ' okx-input--fullwidth' : '') +
          (icon ? ' okx-element-wrapper--with-leading-icon' : '')
        }
      >
        {icon ? (
          <i
            className="material-icons mdc-text-field__icon--leading"
            tabIndex="0"
            role="button"
          >
            {icon}
          </i>
        ) : null}
        <span className="mdc-floating-label mdc-floating-label--float-above">
          {label}
        </span>
        <ReactDatepicker
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          selected={startDate}
          showYearDropdown
          showWeekNumbers
          onChange={(date) => setStartDate(date)}
          placeholderText={placaholder}
          calendarStartDay={1}
          {...props}
          name={nameFormatted}
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
        <input
          type="hidden"
          name={name}
          defaultValue={startDate && startDate.toISOString()}
        />
        {/*
    <input type="date" pattern="\d{4}-\d{2}-\d{2}" {...props} />
    <br />
    <input type="time" />
    <br />
    <input type="datetime-local" />
*/}
      </div>
    </>
  )
}

export default DatePicker
