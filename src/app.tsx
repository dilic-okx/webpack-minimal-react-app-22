import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { getDefaultRoute } from './lib/utils'
import ProtectedRoute from './components/protected-route'

import navConfig from './.nav-config'

import NotFound from './screens/not-found'

const App = () => {
  const mapRoutes = (routes, extraProps = {}) => {
    return routes
      .filter((route) => !!route.path && !!route.element)
      .map((item, index) => {
        const { path } = item
        const Wrapper = item.protected ? ProtectedRoute : React.Fragment

        return (
          <React.Fragment key={'route-' + index}>
            <Route
              path={path}
              element={
                <Wrapper>
                  <item.element {...extraProps} route={item} />
                </Wrapper>
              }
            />
          </React.Fragment>
        )
      })
  }

  const defaultRoute = getDefaultRoute()
  const routeComponents = mapRoutes(navConfig.routes)
  const authRouteComponents = mapRoutes(navConfig.authRoutes)
  const additionalRouteComponents = mapRoutes(navConfig.additionalRoutes)
  const notInMenuRouteComponents = mapRoutes(navConfig.notInMenuRoutes)
  return (
    <Routes>
      {routeComponents}
      {authRouteComponents}
      {additionalRouteComponents}
      {notInMenuRouteComponents}
      {defaultRoute ? (
        <Route path="/" element={<Navigate to={defaultRoute.path} />} />
      ) : null}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
