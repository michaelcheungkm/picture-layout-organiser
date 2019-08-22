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
  render() {
    return (
      <div id='main-grid' className='App'>
        <Grid
          cols={NUM_COLS}
          content={exampleImages.map((img, index) => ({
            id: index,
            display: <ImageSquare image={img} />
          }))}
        />
      </div>
    );
  }
}

export default App;
