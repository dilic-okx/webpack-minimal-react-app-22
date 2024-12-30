import React, { Component } from 'react'

import Layout from '../../components/layout'
import Textfield from '../../components/textfield'
import Checkbox from '../../components/checkbox'
import Radio from '../../components/radio'
import List, { ListItem } from '../../components/list'
import Menu, { MenuGroup, MenuItem, MenuSeparator } from '../../components/menu'
import Select, { Option } from '../../components/select'
import Reselect from '../../components/reselect'
import Slider from '../../components/slider'
import Switch from '../../components/switch'
import File from '../../components/file'
import Button from '../../components/button'
import DatePicker from '../../components/date'
//import Chipset, { Chip } from '../../components/chipset'
import { Subtitle, Sectiontitle } from '../../components/typography'
//import { registerRequest } from '../../store/actions'
import { withTranslation } from '../../lib/translate'
import { form2data } from '../../lib/utils'

//import './index.css'

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
            name="thoughts"
            type="textarea"
            label="Thoughts"
            defaultValue="Some thoughts..."
            helper="Type your comment here"
            required={true}
            rows={3}
            outlined={true}
            fullwidth={true}
            minLength="2"
          />
          <br />
          <Textfield
            name="first-name"
            label="First Name"
            placeholder="Pera"
            defaultValue="Mika"
            icon="star"
            trailingIcon="event"
            helper="Type your first name here"
            required={true}
            minLength="1"
            outlined={true}
            maxLength={10}
            showCounter={true}
            fullwidth={true}
          />
          <br />
          <Textfield
            name="comment"
            type="textarea"
            label="Comment"
            defaultValue="Some comments..."
            helper="Type your comment here"
            required={true}
            rows={4}
            minLength="2"
            maxLength={100}
            showCounter={true}
            fullwidth={true}
          />
          <br />
          <Textfield
            name="last-name"
            label="Last Name"
            defaultValue="Zikic"
            icon="event"
            trailingIcon="star"
            helper="Type your last name here"
            required={true}
            minLength="1"
            maxLength={10}
            showCounter={true}
            fullwidth={true}
          />
          <br />
          <Textfield
            name="x1"
            label="Some Label"
            icon="event"
            trailingIcon="star"
            disabled={true}
            helper="Type your value here"
            minLength="1"
            maxLength={10}
            showCounter={true}
            fullwidth={true}
          />
          <br />
          <DatePicker
            label="Schedule appointment"
            icon="event"
            outlined={true}
            fullwidth={true}
            trailingIcon="star"
            helper="Type your first name here"
            required={true}
            defaultValue="2022-07-11T22:00:00.000Z"
            placaholder="Your date here!"
            name="appointerrr"
          />
          <DatePicker
            label="Your events"
            outlined={false}
            trailingIcon="star"
            fullwidth={true}
            name="eventsdaa"
          />
          <DatePicker
            label="Reminder"
            outlined={false}
            icon="event"
            fullwidth={true}
            name="reminrr"
            showTimeSelect
            defaultValue="2022-04-11T17:00:00.000Z"
          />
          <Checkbox
            name="terms-accept"
            label="Accept terms"
            defaultChecked={true}
            required={true}
          />
          <br />
          <Checkbox
            name="subscription"
            trailingLabel={true}
            label="Subscription"
          />
          <br />
          <Checkbox name="mailing-list" label="Mailing list" disabled={true} />
          <br />
          <Radio label="Male" name="gender" value="m" />
          <Radio label="Female" name="gender" value="f" trailingLabel={true} />
          <Radio label="Andr." name="gender" value="a" disabled={true} />
          <Subtitle>Checkboxes in the list (handled as array)</Subtitle>
          <List role="group">
            <ListItem role="checkbox" label="Ch 1">
              <Checkbox noWrapper={true} name="cbg[]" value="1" />
            </ListItem>
            <ListItem role="checkbox" label="Ch 2">
              <Checkbox noWrapper={true} name="cbg[]" value="2" />
            </ListItem>
            <ListItem role="checkbox" label="Ch 3">
              <Checkbox noWrapper={true} name="cbg[]" value="3" />
            </ListItem>
          </List>
          <Subtitle>Radiogroup in the list</Subtitle>
          <List role="radiogroup">
            <ListItem role="radio" label="Radio 1">
              <Radio noWrapper={true} name="g1" value="1" />
            </ListItem>
            <ListItem role="radio" label="Radio 2">
              <Radio noWrapper={true} name="g1" value="2" />
            </ListItem>
            <ListItem role="radio" label="Radio 3">
              <Radio noWrapper={true} name="g1" value="3" />
            </ListItem>
          </List>
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
            defaultValue="******"
            helper="Type your password here"
            type="text"
            required={true}
            minLength="6"
          />
          <br />
          <Textfield
            name="re-password"
            autoComplete="new-password"
            label="Retype Password"
            defaultValue="******"
            helper="Retype your password here"
            type="text"
            required={true}
            minLength="6"
          />
          <br />
          <Menu anchor={true} buttonProps={{ children: 'Menu', raised: true }}>
            <MenuItem>A Menu Item</MenuItem>
            <MenuItem>Another Menu Item</MenuItem>
            <MenuItem disabled={true}>Disabled Menu Item</MenuItem>
            <MenuSeparator />
            <MenuItem>Yet Another Menu Item</MenuItem>
          </Menu>
          <Menu context={true}>
            <MenuGroup>
              <MenuItem>A Menu Item</MenuItem>
              <MenuItem>Another Menu Item</MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuItem disabled={true}>Disabled Menu Item</MenuItem>
              <MenuItem>A Menu Item</MenuItem>
              <MenuItem>A Menu Item</MenuItem>
            </MenuGroup>
            <MenuItem>A Menu Item</MenuItem>
            <MenuSeparator />
            <MenuItem>Yet Another Menu Item</MenuItem>
          </Menu>
          <br />
          <Select
            name="food1"
            label="Choose some food"
            required={true}
            icon="event"
            fullwidth={true}
            value="1"
          >
            <Option value="1" label="Some Option" />
            <Option value="2" disabled={true} label="Another Option" />
            <Option value="3" label="Yet Another Option" />
          </Select>
          <br />
          <Select
            name="food2"
            label="Choose some food"
            disabled={true}
            fullwidth={true}
          >
            <Option value="1" label="Some Option" />
            <Option value="2" disabled={true} label="Another Option" />
            <Option value="3" label="Yet Another Option" />
          </Select>
          <br />
          <Select
            name="x2"
            label="Test select"
            outlined={true}
            disabled={true}
            icon="event"
            fullwidth={true}
          >
            <Option value="1" label="Some Option" />
            <Option value="2" selected={true} label="Another Option" />
            <Option value="3" label="Yet Another Option" />
          </Select>
          <br />
          <Select
            name="x3"
            label="Test select 2"
            outlined={true}
            helper="Select test2 here"
            icon="star"
            fullwidth={true}
          >
            <Option value="1" label="Some Option" />
            <Option value="2" selected={true} label="Another Option" />
            <Option value="3" label="Yet Another Option" />
          </Select>
          <br />
          <Sectiontitle>
            Multi select dummy - form submission handling test
          </Sectiontitle>
          <select
            name="multi-select-test"
            multiple={true}
            defaultValue={['a', 'c']}
          >
            <option value="a">aaaa</option>
            <option value="b">bbbb</option>
            <option value="c">cccc</option>
          </select>
          <br />
          <Textfield
            name="test-array[]"
            label="Array element 1"
            placeholder="Val 1"
            defaultValue="first val"
            helper="enter array element"
          />
          <br />
          <Textfield
            name="test-array[]"
            label="Array element 2"
            placeholder="Val 2"
            defaultValue="second val"
            helper="enter array element"
          />
          <br />
          <Textfield
            name="test-array[]"
            label="Array element 3"
            placeholder="Val 3"
            defaultValue="third val"
            helper="enter array element"
          />
          <br />
          {/*<Slider name="testslider" discrete={ true } showMarkers={ true } min={ 20 } max={ 50 } step={ 5 } defaultValue={ 30 }/><br />*/}
          <Switch
            name="testswitch1"
            trailingLabel={true}
            defaultChecked={true}
            label="Test Switch 1"
            required={true}
          />
          <br />
          <Switch name="testswitch2" label="Test Switch 2" />
          <br />
          <Sectiontitle>Simple Chips</Sectiontitle>
          {/*<Chipset>
						<Chip label={ 'zika' }/>
						<Chip label={ 'mika' }/>
						<Chip icon="star" label={ 'tika' }/>
						<Chip label={ 'vidoje' }/>
					</Chipset><br /><br />
					<Sectiontitle>Choice Chips</Sectiontitle>
					<Chipset type="choice">
						<Chip label={ 'zika' }/>
						<Chip label={ 'mika' } checked={ true }/>
						<Chip icon="star" label={ 'tika' }/>
						<Chip label={ 'vidoje' }/>
					</Chipset><br /><br />
					<Sectiontitle>Filter Chips</Sectiontitle>
					<Chipset type="filter">
						<Chip label={ 'zika' } checked={ true }/>
						<Chip label={ 'mika' } checked={ true }/>
						<Chip icon="star" label={ 'tika' }/>
						<Chip label={ 'vidoje' }/>
					</Chipset><br /><br />
					<Sectiontitle>Input Chips</Sectiontitle>
					<Chipset type="input" name="chipset-test">
						<Chip label={ 'zika' }/>
						<Chip label={ 'mika' }/>
						<Chip icon="star" label={ 'tika' }/>
						<Chip label={ 'vidoje' }/>
					</Chipset><br /><br />*/}
          <Sectiontitle>Single file upload</Sectiontitle>
          <File name="file-upload-test" />
          <br />
          <br />
          <Sectiontitle>Multiple files upload</Sectiontitle>
          <File name="multi-files-upload-test" multiple={true} />
          <br />
          <br />
          <Reselect
            name="test-reselect-1"
            label="Test Reselect"
            defaultValue={['val-0']}
            multiple={true}
            options={[
              { value: 'val-0', label: 'Chocolate' },
              { value: 'val-1', label: 'Sugar' },
              { value: 'val-2', label: 'Eggs' }
            ]}
          />
          <br />
          <br />
          <Reselect
            name="test-reselect-2"
            label="Test Reselect 2"
            defaultValue={[0]}
            outlined={true}
            multiple={true}
            options={[
              { value: 0, label: 'Opt 1' },
              { value: 1, label: 'Opt 2' },
              { value: 2, label: 'Opt 3' }
            ]}
          />
          <br />
          <br />
          <Reselect
            name="test-reselect-3"
            label="Test Reselect 3"
            defaultValue={[0]}
            outlined={true}
            options={[
              { value: 0, label: 'Opt 1' },
              { value: 1, label: 'Opt 2' },
              { value: 2, label: 'Opt 3' }
            ]}
          />
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
