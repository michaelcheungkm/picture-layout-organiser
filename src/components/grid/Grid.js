import React from 'react';
import './Grid.css';

class Grid extends React.Component {

  render() {

    var rows=[];
    for(var i = 0; i < this.props.content.length; i += this.props.cols) {
      rows.push(
        <div className='grid-row'>
          {this.props.content.slice(i, i + this.props.cols).map(i =>
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
