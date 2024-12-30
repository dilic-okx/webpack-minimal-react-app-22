import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './app'

require('@material/theme/dist/mdc.theme.css')
require('@material/typography/dist/mdc.typography.css')
require('./theme/index.css')

const root = createRoot(document.getElementById('root'))

root.render(
  <Router>
    <App />
  </Router>
)
