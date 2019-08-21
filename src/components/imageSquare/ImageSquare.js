import React from 'react';
import './ImageSquare.css';

class ImageSquare extends React.Component {

  render() {
    return (
      <div className='image-square'>
       <img src={this.props.image} />
      </div>
    );
  }
}

export default ImageSquare;
