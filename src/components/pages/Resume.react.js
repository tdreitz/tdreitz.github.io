import React, { PropTypes } from 'react'

const styles = {
  items: {
    listStyleType: 'decimal-leading-zero'
  }
}

class Resume extends React.Component {
  render () {
    return (
      <div>
        <h1>This is some work I did</h1>
        <ul>
          <li style={styles.items}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum iusto dolorem placeat quod possimus laboriosam dolores quibusdam soluta magni facere consequuntur quia, molestias dicta facilis sed recusandae fugit, nisi laborum!</li>
          <li style={styles.items}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum iusto dolorem placeat quod possimus laboriosam dolores quibusdam soluta magni facere consequuntur quia, molestias dicta facilis sed recusandae fugit, nisi laborum!</li>
          <li style={styles.items}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum iusto dolorem placeat quod possimus laboriosam dolores quibusdam soluta magni facere consequuntur quia, molestias dicta facilis sed recusandae fugit, nisi laborum!</li>
        </ul>
      </div>
    )
  }
}

export default Resume
