import React from 'react'

export const BigLabel = ({ tag, color, className, children }) => {
  const Tag = tag || 'div'
  return (
    <Tag
      className={
        'big-label mdc-typography--headline4' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </Tag>
  )
}

export const Title = ({ tag, color, className, children }) => {
  const Tag = tag || 'div'
  return (
    <Tag
      className={
        'title mdc-typography--headline5' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </Tag>
  )
}

export const Subtitle = ({ tag, color, className, children }) => {
  const Tag = tag || 'div'
  return (
    <Tag
      className={
        'subtitle mdc-typography--headline6' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </Tag>
  )
}

export const Sectiontitle = ({ tag, color, className, children }) => {
  const Tag = tag || 'div'
  return (
    <Tag
      className={
        'sectiontitle mdc-typography--subtitle1' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </Tag>
  )
}

export const NormalText = ({ tag, color, className, children }) => {
  const Tag = tag || 'span'
  return (
    <Tag
      className={
        'normal-text mdc-typography--body2' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </Tag>
  )
}

export const SmallText = (props) => {
  const { tag, color, className, children, ...rest } = props
  const Tag = tag || 'span'
  return (
    <Tag
      className={
        'small-text mdc-typography--caption' +
        (color ? ' okx-color-' + color : '') +
        (className ? ' ' + className : '')
      }
      {...rest}
    >
      {children}
    </Tag>
  )
}

export const ErrorText = (props) => {
  const { value, className } = props
  let err =
    value === '' ? null : (
      <div
        className={
          'error-text mdc-typography--caption' +
          (className ? ' ' + className : '')
        }
      >
        {value}
      </div>
    )
  return err
}

type SpacerProps = {
  size?: number
  tag?: string
}

export const Spacer = ({ tag, size }: SpacerProps) => {
  const Tag = tag || 'br'
  const times = []
  for (let i = 0; i < (size || 2); i++) {
    times.push('')
  }
  return (
    <>
      {times.map((es, i) => (
        <Tag key={'spacer-' + es + i} />
      ))}
    </>
  )
}
