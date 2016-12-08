import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/App'
import Home from './components/pages/Home'
import Resume from './components/pages/Resume'
import Work from './components/pages/Work'
import Blog from './components/pages/Blog'
// import Elements from './components/pages/Elements'
// import PageNotFound from './components/PageNotFound'

ReactDOM.render((
    <Router history={browserHistory}>

      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='/resume' component={Resume} />
        <Route path='/work' component={Work} />
        <Route path='/blog' component={Blog} />
        {/* <Route path='/elements' component={Elements} /> */}
        {/* <Route path='*' component={PageNotFound} /> */}
      </Route>

    </Router>
  ),
  document.getElementById('root')
)
