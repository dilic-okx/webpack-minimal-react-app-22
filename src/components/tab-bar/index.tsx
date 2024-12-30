import React, { useState, useEffect } from 'react'
import { MDCTabBar } from '@material/tab-bar'

import './index.css'

export const Tab: React.FC = (props: any) => {
  const { isActive, icon, label, children, tabIndex } = props
  return (
    <button
      className={'mdc-tab' + (isActive ? ' mdc-tab--active' : '')}
      role="tab"
      tabIndex={tabIndex}
      aria-selected={isActive ? 'true' : 'false'}
    >
      <span className="mdc-tab__content">
        {icon ? (
          <span className="mdc-tab__icon material-icons" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="mdc-tab__text-label">{label || children}</span>
      </span>
      <span className="mdc-tab-indicator">
        <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span className="mdc-tab__ripple"></span>
    </button>
  )
}
const TabBar: React.FC = (props: any) => {
  const { id, onActivation, className, children } = props
  const [tabBar, setTabBar] = useState(null)

  const setupTabBar = () => {
    const selector = props.id ? '#' + props.id : '.mdc-tab-bar'
    if (document.querySelector(selector)) {
      const tb = MDCTabBar.attachTo(document.querySelector(selector) as Element)
      if (onActivation) {
        tb.listen('MDCTabBar:activated', onActivation)
      }
      setTabBar(tb)
      tb.activateTab(0)
    } else {
      setTimeout(setupTabBar, 200)
    }
  }

  useEffect(() => {
    if (!tabBar) {
      setupTabBar()
    }
  })

  return (
    <div
      id={id}
      className={'mdc-tab-bar' + (className ? ' ' + className : '')}
      role="tablist"
    >
      <div className="mdc-tab-scroller">
        <div className="mdc-tab-scroller__scroll-area">
          <div className="mdc-tab-scroller__scroll-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default TabBar
