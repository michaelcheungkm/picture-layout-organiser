import React, {Component} from 'react';

import './EditPage.css';

import crossImage from '../../images/cross.svg'

class EditPage extends Component {

  render() {
    return (
      <div className='edit-page'>
        <img
          src={crossImage}
          className='exit-icon'
          onClick={() => this.props.saveAndClose("Test")}
        />
        test
      </div>
    );
  }
}

export default EditPage;
