import React, {Component} from 'react';

import './Grid.css';

class Grid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    };
  }

  render() {
    var rows=[];
    for(var i = 0; i < this.state.content.length; i += this.props.cols) {
      rows.push(
        <div className='grid-row'>
          {this.state.content.slice(i, i + this.props.cols).map(i =>
            <div className='grid-item'>{i}</div>
          )}
        </div>
      );
    }

    return (
      <div className='grid'>
        {rows}
      </div>
    );
  }
}

export default Grid;
