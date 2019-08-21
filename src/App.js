import React from 'react';
import './App.css';

import Grid from './components/grid/Grid.js';


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Grid
          cols={3}
          content={["Hello1","Hello2","Hello3","Hello4","Hello5"]}
        />
      </div>
    );
  }
}

export default App;
