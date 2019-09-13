import React, {Component} from 'react';

import './EditPage.css';

import crossImage from '../../images/cross.svg'
import binImage from '../../images/bin.svg'

class EditPage extends Component {

  render() {
    return (
      <div className='edit-page'>
        <img
          src={crossImage}
          className='exit-icon'
          onClick={() => this.props.saveAndClose("Test")}
        />
        <img
          src={binImage}
          className='image-delete-icon'
          onClick={this.props.deleteImage}
        />
        test
      </div>
    );
  }
}

export default EditPage;
