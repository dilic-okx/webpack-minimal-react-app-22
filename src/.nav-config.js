import Home from './screens/home'
import Dashboard from './screens/dashboard'
import Info from './screens/info'
//import Account from './screens/account'
//import Feedback from './screens/feedback'
//import Locations from './screens/locations'
//import Social from './screens/social'
import Search from './screens/search'
//import VictoryChart from './screens/victory-chart'
import Themer from './screens/themer'

import Login from './screens/login'
import Register from './screens/register'
import ResetPassword from './screens/reset-password'

import Terms from './screens/terms'
import Privacy from './screens/privacy'
import Faq from './screens/faq'

const navConfig = {
  routes: [
    {
      label: 'Home',
      path: '/home',
      element: Home,
      icon: 'home',
      default: true
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      element: Dashboard,
      icon: 'dashboard',
      protected: true
      //exact: true,
      //default: true
    },
    {
      label: 'Info',
      path: '/info',
      element: Info,
      icon: 'info',
      protected: true
      //exact: true,
      //default: true
    },
    {
      label: 'Search',
      path: '/search',
      element: Search,
      icon: 'search',
      protected: true
    },
    //{ label: 'Locations', path: '/locations', component: Locations, icon: 'navigation' },
    //{ label: 'Victory Chart', path: '/victory-chart', component: VictoryChart, icon: 'color_lens', trailingIcon:'star', description: 'aaa' },
    {
      label: 'Themer',
      path: '/themer',
      element: Themer,
      icon: 'color_lens',
      description: 'Components showcase'
    }
  ],
  authRoutes: [
    {
      label: 'Login',
      path: '/login',
      element: Login,
      icon: 'login',
      fn: 'login'
    },
    { label: 'Logout', path: '/logout', icon: 'logout', fn: 'logout' }
  ],
  additionalRoutes: [
    { label: 'Terms & Conditions', path: '/terms', element: Terms },
    { label: 'Privacy Policy', path: '/privacy', element: Privacy },
    { label: 'Faq & Support', path: '/faq', element: Faq }
  ],
  notInMenuRoutes: [
    { path: '/register', element: Register },
    { path: '/reset-password', element: ResetPassword }
  ]
}

export default navConfig
