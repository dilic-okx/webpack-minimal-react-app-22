import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
import Textfield from '../../components/textfield'
import Button from '../../components/button'
import { loginRequest } from '../../store/actions'
import { withTranslation } from '../../lib/translate'

const Login = (props) => {
  const data: any = {}
  const { username, password } = data as any

  const [form, setForm] = useState({ username, password })
  const [errors, setErrors] = useState({})
  const [valid, setValid] = useState(false)

  useEffect(() => {
    if (
      form.username &&
      form.password &&
      form.username !== '' &&
      form.password !== '' &&
      Object.keys(errors).length === 0
    ) {
      setValid(true)
      return
    }
    setValid(false)
  }, [form])

  const handleLogin = () => {
    const { username, password } = form
    props.dispatch(loginRequest({ username, password }))
  }

  const handleFormUpdate = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.checkValidity(e)) {
      delete errors[e.target.name]
      setErrors({ ...errors })
    } else {
      setErrors({ ...errors, [e.target.name]: 1 })
    }
  }

  const { __ } = props
  const navigate = useNavigate()
  const disabledAttr = !valid ? { disabled: 'disabled' } : {}
  return (
    <Layout label={__('Login')}>
      <div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                return false
              }}
            >
              <Textfield
                name="username"
                autoComplete="username"
                icon="person"
                label={__('Username')}
                helper={__('Type your email (username) here')}
                onKeyUp={handleFormUpdate}
                defaultValue={username}
                type="email"
                required={true}
                minLength="5"
              />
              <br />
              <Textfield
                name="password"
                autoComplete="current-password"
                icon="lock"
                label="Password"
                helper={__('Type your password here')}
                onKeyUp={handleFormUpdate}
                type="password"
                defaultValue={password}
                required={true}
                minLength="6"
              />
              <br />
              <Button raised onClick={handleLogin} {...disabledAttr}>
                {__('Login')}
              </Button>
            </form>
            <p>{__('Not a member? Click bellow to')}</p>
            <Button onClick={() => navigate('/register')}>
              {__('Register')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation(Login)
