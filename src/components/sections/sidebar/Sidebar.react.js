import React from 'react'

import styles from './Sidebar.css'

class Sidebar extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <h4 className={styles.heading}>* Developer Stats *</h4>
        <ul className={styles.list}>
          <li className={styles.bullets}><a target="_blank" href="https://github.com/tdreitz">github.com/tdreitz</a></li>
          <li className={styles.bullets}><a target="_blank" href="https://twitter.com/tyler_the_dvlpr">twitter.com/tyler_the_dvlpr</a></li>
          <li className={styles.bullets}><a target="_blank" href="https://www.linkedin.com/in/tylerreitz">linkedin.com/tylerreitz</a></li>
        </ul>
        <ul className={styles.list}>
          <li className={styles.bullets}>Editor: Atom-beta</li>
          <li className={styles.bullets}>Shell: Fish</li>
        </ul>
      </div>
    )
  }
}

export default Sidebar;
