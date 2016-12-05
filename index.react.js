import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import 'current-input'

import App from './components/App.react.js'

import Home from './components/components/pages/Home'
import Resume from './components/components/pages/Resume'
import Work from './components/components/pages/Work'
import Blog from './components/components/pages/Blog'

import PageNotFound from './components/PageNotFound'

// import ExampleComponent from './components/ExampleComponent'
// import ExampleTwoDeepComponent from './components/ExampleTwoDeepComponent'


const routes = (
  <Route path="/" mapMenuTitle="Home" component={App}>
    <IndexRoute component={Home} />

    <Route path='/resume' component={Resume} />
    <Route path='/work' component={Work} />
    <Route path='/blog' component={Blog} />

    {/* <Route path="example" mapMenuTitle="Example" component={ExampleComponent}>
      <Route path="two-deep" mapMenuTitle="Two Deep" component={ExampleTwoDeepComponent} />
    </Route> */}

    <Route path="*" mapMenuTitle="Page Not Found" component={PageNotFound} />
  </Route>
)


render(
  <Router
    history={browserHistory}
    routes={routes}
  />,
  document.getElementById('root')
)
