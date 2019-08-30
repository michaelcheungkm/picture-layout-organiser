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

class App extends Component {

  constructor(props) {
    super(props);
    // TODO: Replace with backend results
    this.state = {
      // TODO: leave as empty when not developing
      backendAddress: "null",
      saved: false,
      selectedID: -1,
      content : exampleImages.map((img, index) => ({
        id: index,
        img: img,
      }))
    }
  }

  render() {
    if (this.state.backendAddress == null) {
      // TODO: Proper no backend repsonse
      return (
        "No backend"
      );
    } else {
      return (
        <div id='main-grid' className='App'>
        <Grid
          cols={NUM_COLS}
          gridContent={this.state.content.map(c => ({
            display:
              <ImageSquare
                id={c.id}
                image={c.img}
                selected={this.state.selectedID === c.id}
                handleClick={function(){
                  this.setState({selectedID: this.state.selectedID === c.id ? -1 : c.id})
                }.bind(this)}
              />
          }))}
        />
        </div>
      );
    }
  }
}

export default App;
