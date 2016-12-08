import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './NavLink.css'

class NavLink extends React.Component {
  render () {
    return <Link {...this.props} className={styles.link} activeClassName={styles.active}/>
  }
}

export default NavLink
