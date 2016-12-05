import React, { PropTypes } from 'react'
import { IndexLink } from 'react-router'
import NavLink from '../../elements/NavLink/NavLink'

import styles from './Header.css'

class Header extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.logo}> Tyler Reitz </h1>
          <ul role='nav' className={styles.nav}>
            <li className={styles.items}><IndexLink to='/' className={styles.link} activeClassName={styles.active}>Home</IndexLink></li>
            <li className={styles.items}><NavLink to='/resume'>Resume</NavLink></li>
            <li className={styles.items}><NavLink to='/work'>Work</NavLink></li>
            <li className={styles.items}><NavLink to='/blog'>Blog</NavLink></li>
            {/* <li className={styles.items}><NavLink to='/elements'>Elements</NavLink></li> */}
          </ul>
        </div>
      </div>
    )
  }
}

export default Header;
