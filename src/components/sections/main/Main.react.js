import React, { PropTypes } from 'react'
import Sidebar from '../sidebar/Sidebar'

import styles from './Main.css'

class Main extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Main;
