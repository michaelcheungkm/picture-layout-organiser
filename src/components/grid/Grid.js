import React from 'react';
import './Grid.css';

class Grid extends React.Component {

  render() {

    var items=[];
    for(var i = 0; i<this.props.content.length; i++) {
      var cont = <span className='grid-item'>{this.props.content[i]}</span>
      items.push(cont);
      if (i % 3 == 2) {
        items.push(<br/>);
      }
    }

    return (
      items
    );
  }
}

export default Grid;
