import React, {Component} from 'react';
import './App.css';

import Grid from './components/grid/Grid.js';
import ImageSquare from './components/imageSquare/ImageSquare.js';

import img1 from './example_images/1.png';
import img2 from './example_images/2.png';
import img3 from './example_images/3.png';
import img4 from './example_images/4.png';
import img5 from './example_images/5.png';
import img6 from './example_images/6.png';
var exampleImages = [img1, img2, img3, img4, img5, img6];

const NUM_COLS = 3;
const ENTER_KEY = 13;
const NONE_SELECTED_ID = -1;

class App extends Component {

  constructor(props) {
    super(props);
    // TODO: Replace with backend results
    this.state = {
      // TODO: leave as empty when not developing
      backendAddress: "null",
      saved: false,
      selectedID: NONE_SELECTED_ID,
      content : exampleImages.map((img, index) => ({
        id: index,
        img: img,
      }))
    }
  }

  render() {
    var gridContent = (
      <div id='main-grid' className='App' >
      <Grid
        cols={NUM_COLS}
        gridContent={this.state.content.map(c => ({
          display:
            <ImageSquare
              id={c.id}
              image={c.img}
              selected={this.state.selectedID === c.id}
              handleClick={function() {
                this.setState({selectedID: this.state.selectedID === c.id ? NONE_SELECTED_ID : c.id})
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
          <input type="text" onKeyDown={function(e){
            if (e.keyCode === ENTER_KEY) {
              this.setState({backendAddress: e.target.value})
            }
          }.bind(this)}
          />
        </div>
        {this.state.backendAddress !== null ? gridContent : "No backend"}
      </div>
    );
  }
}

export default App;
