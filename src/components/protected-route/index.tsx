import React from 'react'
import { Navigate } from 'react-router-dom'

//import { restoreAuth, setProtectedReferrer } from '../../store/actions.js'

//class ProtectedRoute extends React.Component {
const ProtectedRoute = ({ children }) => {
  /*async componentDidMount() {
    const { Component, render, auth, path } = this.props
    const { loggedIn } = auth
    if (!(loggedIn && (Component || render))) {
      this.props.dispatch(setProtectedReferrer(path))
      this.props.dispatch(restoreAuth())
    }
  }*/

  const auth = { loggedIn: true }
  const { loggedIn } = auth
  return loggedIn ? children : <Navigate to="/login" />
}

export default ProtectedRoute
