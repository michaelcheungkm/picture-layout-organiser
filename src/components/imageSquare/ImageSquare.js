import React from 'react';
import './ImageSquare.css';

class ImageSquare extends React.Component {


  render() {
    var backgroundImageStyle = {
      'backgroundImage': 'url(' + this.props.image + ')'
    }

    return (
      <div className='image-square' style={backgroundImageStyle}>
      </div>
    );
  }
}

export default ImageSquare;
