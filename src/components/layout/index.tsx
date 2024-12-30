import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Drawer, { DrawerTitle, DrawerSubtitle, DrawerContent } from '../drawer'
import List, { ListItem } from '../list'
//import Icon from '../icon'
import { Spacer } from '../typography'
import { MDCTopAppBar } from '@material/top-app-bar'

import appConfig from '../../.app-config'
import navConfig from '../../.nav-config'

require('./index.css')

export const withRouter = (Component) => {
  const ComponentWithRouterProp = (props) => {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()
    return <Component {...props} router={{ location, navigate, params }} />
  }

  return ComponentWithRouterProp
}

const Layout = (props) => {
  const {
    auth,
    router,
    label,
    title,
    noPadding,
    contentClassName,
    children,
    compact
  } = props
  const { location, navigate } = router

  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    MDCTopAppBar.attachTo(document.querySelector('.mdc-top-app-bar'))
  })

  const NavLink = (navLinkProps) => {
    const { item, hideIcon, className } = navLinkProps
    if (!item) {
      return null
    }
    const { path, icon, trailingIcon, label, description } = item
    const selected = location.pathname === path
    const twoLineAttr = description ? { secondary: description } : {}
    const selectedAttr = selected ? { selected: true } : {}
    const activatedAttr = selected ? { activated: true } : {}
    const iconAttr = !hideIcon && icon ? { icon } : {}
    const trailingIconAttr = !hideIcon && trailingIcon ? { trailingIcon } : {}
    return (
      <ListItem
        {...iconAttr}
        {...trailingIconAttr}
        className={className || null}
        {...twoLineAttr}
        graphic="avatar"
        {...selectedAttr}
        {...activatedAttr}
        onClick={() => {
          setDrawerOpen(false)
          navigate(path)
        }}
      >
        {label}
      </ListItem>
    )
  }
  const { loggedIn } = auth || {}
  const headerTitle = label || title || appConfig.general.clientName
  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerSubtitle>subtitle</DrawerSubtitle>
        <DrawerContent>
          <List role="listbox" addFocusTrap={true}>
            {navConfig.routes
              .filter((route) => !!route.path && !route.notInDrawer)
              .map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            <NavLink
              item={navConfig.authRoutes.find(
                (item) => item.fn === (loggedIn ? 'logout' : 'login')
              )}
            />
            <Spacer size={2} />
            {navConfig.additionalRoutes
              .filter((route) => !!route.path)
              .map((item) => (
                <NavLink
                  key={item.path}
                  className="small-text"
                  item={item}
                  hideIcon={true}
                />
              ))}
          </List>
        </DrawerContent>
      </Drawer>
      <div className="mdc-drawer-app-content">
        <header className={'mdc-top-app-bar' + (compact ? ' compact' : '')}>
          <div className="mdc-top-app-bar__row">
            <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
              <button
                onClick={() => setDrawerOpen(true)}
                className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
              >
                menu
              </button>
              <span className="mdc-top-app-bar__title">{headerTitle}</span>
            </section>
            <section
              className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
              role="toolbar"
            >
              <button
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Download"
              >
                file_download
              </button>
              <button
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Print this page"
              >
                print
              </button>
              <button
                className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                aria-label="Bookmark this page"
              >
                bookmark
              </button>
            </section>
          </div>
        </header>
        <div
          className={
            'main-content' +
            (contentClassName ? ' ' + contentClassName : '') +
            (noPadding ? ' no-padding' : '')
          }
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default withRouter(Layout)
