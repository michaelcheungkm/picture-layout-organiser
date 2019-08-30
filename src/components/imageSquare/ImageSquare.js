import React, {Component} from 'react';
import './ImageSquare.css';

class ImageSquare extends Component {


  render() {
    var backgroundImageStyle = {
      'backgroundImage': 'url(' + this.props.image + ')'
    }

    var classString = 'image-square' + (this.props.selected ? ' selected' : '');

    return (
      <div
        className={classString}
        style={backgroundImageStyle}
        onClick={this.props.handleClick}
        >
      </div>
    );
  }
}

export default ImageSquare;
