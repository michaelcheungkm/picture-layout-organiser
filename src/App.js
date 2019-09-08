import React, {Component} from 'react';
import './App.css';

import Grid from './components/grid/Grid.js';
import ImageSquare from './components/imageSquare/ImageSquare.js';
import arraySwap from './ArraySwap.js';

import {listUsers} from './adapters/ManagerAdapter.js';

import img1 from './example_images/1.png';
import img2 from './example_images/2.png';
import img3 from './example_images/3.png';
import img4 from './example_images/4.png';
import img5 from './example_images/5.png';
import img6 from './example_images/6.png';
var exampleImages = [img1, img2, img3, img4, img5, img6];

const NUM_COLS = 3;
const NONE_SELECTED_INDEX = -1;

const ENTER_KEY = 13;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

class App extends Component {

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    // TODO: Replace with backend results
    this.state = {
      // TODO: leave as empty when not developing
      backendAddress: "null",
      users: [],
      selectedIndex: NONE_SELECTED_INDEX,
      content : exampleImages.map(img => ({
        img: img
      }))
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown(e) {
    if (this.state.selectedIndex !== NONE_SELECTED_INDEX) {
      // TODO: replace with map
      if (e.keyCode === LEFT_KEY) {
        var indexChange = -1;
      } else if (e.keyCode === UP_KEY) {
        var indexChange = -1 * NUM_COLS;
      } else if (e.keyCode === RIGHT_KEY) {
        var indexChange = 1;
      } else if (e.keyCode === DOWN_KEY) {
        var indexChange = NUM_COLS;
      } else {
        return;
      }

      this.setState({
        content: arraySwap(this.state.content, this.state.selectedIndex, this.state.selectedIndex + indexChange),
        selectedIndex: this.state.selectedIndex + indexChange
      });
    }
  }

  deselectSelectedItem() {
    this.setState({selectedIndex: NONE_SELECTED_INDEX})
  }

  render() {
    var gridContent = (
      <div id='main-grid' className='App' >
      <Grid
        cols={NUM_COLS}
        gridContent={this.state.content.map((c, index) => ({
          display:
            <ImageSquare
              image={c.img}
              selected={this.state.selectedIndex === index}
              handleClick={function() {
                if (this.state.selectedIndex === index) {
                  this.deselectSelectedItem();
                } else {
                  this.setState({selectedIndex: index});
                }
              }.bind(this)}
            />
        }))}
      />
      </div>
    );

    return (
      <div>
        <div className="top-bar">
          Backend Address:
          <input
            type="text"
            onKeyDown={function(e){
              if (e.keyCode === ENTER_KEY) {
                this.setState({backendAddress: e.target.value});
                listUsers(e.target.value, function(users){
                  this.setState({'users':users})
                }.bind(this));
              }
            }.bind(this)}
            onFocus={function(e){
              this.deselectSelectedItem();
            }.bind(this)}
          />
          <select id='account-select'>
            {this.state.users.map(username =>
              (<option key={username} value={username}>{username}</option>)
            )}
          </select>
        </div>
        {this.state.backendAddress !== null ? gridContent : "No backend"}
      </div>
    );
  }
}

export default App;
