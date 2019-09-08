import React, {Component} from 'react';
import './App.css';

import Grid from './components/grid/Grid.js';
import ImageSquare from './components/imageSquare/ImageSquare.js';
import arraySwap from './ArraySwap.js';

import {getFormattedAddress, listUsers, getUserContent, saveUserContent, loadAllAndGetUserContent} from './adapters/ManagerAdapter.js';

import img1 from './example_images/1.png';
import img2 from './example_images/2.png';
import img3 from './example_images/3.png';
import img4 from './example_images/4.png';
import img5 from './example_images/5.png';
import img6 from './example_images/6.png';
var exampleImages = [img1, img2, img3, img4, img5, img6];

const NUM_COLS = 3;
const NONE_SELECTED_INDEX = -1;

const ENTER_KEY = 13;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

var lastUpdate = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      backendAddress: "null",
      imageHostAddress: "null",
      users: [],
      selectedIndex: NONE_SELECTED_INDEX,
      content: [],
      username: '',
      saved: true
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown(e) {
    if (this.state.selectedIndex !== NONE_SELECTED_INDEX) {
      var indexChangeMap = new Map([[LEFT_KEY, -1], [UP_KEY, -1 * NUM_COLS], [RIGHT_KEY, 1], [DOWN_KEY, NUM_COLS]]);
      try{
        this.setState({
          content: arraySwap(this.state.content, this.state.selectedIndex, this.state.selectedIndex + indexChangeMap.get(e.keyCode)),
          selectedIndex: this.state.selectedIndex + indexChangeMap.get(e.keyCode),
          saved: false
        });
      } catch(err) {
        console.log(err);
      }

      // 2 seconds after last update, issue a save
      lastUpdate = Date.now();
      setTimeout(function(){
        if (Date.now() - lastUpdate > 1900) {
          saveUserContent(this.state.username, this.state.content, this.state.backendAddress, function(){
            this.setState({'saved':true});
          }.bind(this));
        }
      }.bind(this), 2000)
    }
  }

  deselectSelectedItem() {
    this.setState({selectedIndex: NONE_SELECTED_INDEX})
  }

  render() {
    var gridContent = (
      <div id='main-grid' className='App' >
      <h2>{this.state.saved ? "Content is saved and up-to-date" : "Saving"}</h2>
      <Grid
        cols={NUM_COLS}
        gridContent={this.state.content.map((c, index) => ({
          display:
            <ImageSquare
              image={getFormattedAddress(this.state.imageHostAddress) + '/' + c.img}
              selected={this.state.selectedIndex === index}
              handleClick={function() {
                if (this.state.selectedIndex === index) {
                  this.deselectSelectedItem();
                } else {
                  this.setState({selectedIndex: index});
                }
              }.bind(this)}
            />
        }))}
      />
      </div>
    );

    return (
      <div>
        <div className="top-bar">
          <span className='account-select'>
            Account:
            <select
              onChange={function(e){
                var username = e.target.value;
                getUserContent(username, this.state.backendAddress, function(content){
                  this.setState(
                    {
                      'username': username,
                      'content': content
                    }
                  );
                }.bind(this))
              }.bind(this)}
            >
              <option value=''>None selected</option>
              {this.state.users.map(username =>
                (<option key={username} value={username}>{username}</option>)
              )}
            </select>
          </span>
          <span className="top-bar-right">
            Backend Address:
            <input
            type="text"
            onKeyDown={
              function(e){
                if (e.keyCode === ENTER_KEY) {
                  this.setState({backendAddress: e.target.value});
                  listUsers(e.target.value, function(users){
                    this.setState({'users':users})
                  }.bind(this));
                }
              }.bind(this)}
            onFocus={function(e){
              this.deselectSelectedItem();
              }.bind(this)}
            />
            Image Host Address:
            <input
            type="text"
            onKeyDown={
              function(e){
                if (e.keyCode === ENTER_KEY) {
                  this.setState({imageHostAddress: e.target.value});
                }
              }.bind(this)}
            onFocus={function(e){
              this.deselectSelectedItem();
              }.bind(this)}
            />
            <button
              id='load-all-button'
              onClick={function(){
                loadAllAndGetUserContent(this.state.username, this.state.backendAddress, function(content) {
                  this.setState({'content': content});
                }.bind(this));
              }.bind(this)}
            >
              Load all from server
            </button>
          </span>
        </div>
        {this.state.backendAddress !== null && this.state.username !== '' ? gridContent : "No backend"}
      </div>
    );
  }
}

export default App;
