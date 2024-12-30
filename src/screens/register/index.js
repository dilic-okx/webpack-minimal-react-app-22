import React, { Component } from 'react'

import Layout from '../../components/layout'
import Textfield from '../../components/textfield'
import Button from '../../components/button'
//import { registerRequest } from '../../store/actions'
import { withTranslation } from '../../lib/translate'
import { form2data } from '../../lib/utils'

import './index.css'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
    this.handleRegister = this.handleRegister.bind(this)
  }

  handleRegister(e) {
    e.preventDefault()
    try {
      const data = form2data(document.forms[0].elements, true)
      console.log('submit', data)
      if (!data.errors) {
        //this.props.dispatch(registerRequest(data))
      }
    } catch (e) {
      console.error(e)
      //throw new Error(e.message)
    }
    return false
  }

  componentDidMount() {
    //document.querySelectorAll('.mdc-text-field').forEach(el => { el.addEventListener('keyup', this.validate)})
  }

  render() {
    const { __ } = this.props
    const { errors } = this.state
    const formValid = Object.keys(errors).length === 0
    const disabledAttr = formValid ? {} : { disabled: true }
    return (
      <Layout title={__('Register')}>
        <form
          action="#"
          onSubmit={this.handleRegister}
          method="post"
          encType="multipart/form-data"
        >
          <Textfield
            name="username"
            autoComplete="username"
            label="Username"
            defaultValue="mika@mika.com"
            helper="Type your email here"
            type="email"
            required={true}
            minLength="5"
          />
          <br />
          <Textfield
            name="password"
            autoComplete="new-password"
            label="Password"
            defaultValue="test123"
            helper="Type your password here"
            type="password"
            required={true}
            minLength="6"
          />
          <br />
          <Textfield
            name="re-password"
            autoComplete="new-password"
            label="Retype Password"
            defaultValue="test123"
            helper="Retype your password here"
            type="password"
            required={true}
            minLength="6"
          />
          <br />
          <br />
          <Button raised={true} {...disabledAttr}>
            {__('Register')}
          </Button>
          <br />
        </form>
      </Layout>
    )
  }
}

export default withTranslation(Register)
