import React, { PropTypes } from 'react'

class Elements extends React.Component {
  render () {
    return (
      <div>

        <div>
            <h4>Typography</h4>

            <div>
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>
            </div>

            <div>
              <div >
                <h1 >Take a look at this amazing headline</h1>
                <h2 >Don't forget about the subtitle</h2>
                <p>This is a typical paragraph for the UI Kit. <a href="#">Here is what a link might look like</a>. The typical font family for this kit is Helvetica Neue.  This kit is intended for clean and refreshing web layouts. No jazz hands here, just the essentials to make dreams come true, with minimal clean web design. The kit comes fully equipped with everything from full responsive media styling to buttons to form fields. <em>I enjoy using italics as well from time to time</em>. Fell free to create the most amazing designs ever with this kit. I truly hope you enjoy not only the kit but this amazing paragraph as well. :)</p>
                <blockquote>You know what really gets me going? A really nice set of block quotes.  That's right, block quotes that say, "Hey, I'm an article you want to read and nurture."</blockquote>
              </div>
            </div>

            <h4>Buttons</h4>

            <div>
              <div>
                <a>Button Default</a>
                <a>Button Success</a>
                <a>Button Error</a>
                <button>Button Warning</button>
                <button>Button Info</button>
              </div>
            </div>

            <h4>Form Elements</h4>

            <div>
              <div>
                <form>
                  <label>Name:</label>
                  <input />

                  <label >Email:</label>
                  <input />

                  <label >Message:</label>
                  <textarea ></textarea>

                  <input />
                  <input />
                </form>
              </div>
            </div>

            <h4 >Media</h4>

            <div >
              <div >
                <img src="#" alt="sample image" />
              </div>
              <div >
                <img />
              </div>
              <div >
                <img />
              </div>
            </div>

            <h4 >Footer</h4>

            <div >
                <footer >
                  <a >
                    <b >Poly - UI Toolkit</b>
                  </a>
                  <p>A simple UI Kit for everyone to share and enjoy.</p>
                </footer>
            </div>
        </div>

      </div>
    )
  }
}

export default Elements;
