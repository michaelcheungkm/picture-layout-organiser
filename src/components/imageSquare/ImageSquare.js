import React, {Component} from 'react';
import './ImageSquare.css';

import ringCircle from '../../images/ring-circle.svg';
import padlock from '../../images/padlock.svg';

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
        {this.props.blank ? null :
          (<img
          src={this.props.locked ? padlock : ringCircle}
          className='lock-ring icon'
          onClick={this.props.toggleLock}
          />)
        }
      </div>
    );
  }
}

export default ImageSquare;
