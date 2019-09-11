import React, {Component} from 'react';
import './App.css';

import Grid from './components/grid/Grid.js';
import ImageSquare from './components/imageSquare/ImageSquare.js';
import arraySwap from './ArraySwap.js';

import {
  getFormattedAddress,
  listUsers,
  getUserContent,
  saveUserContent,
  loadAllAndGetUserContent,
  createAccount
  } from './adapters/ManagerAdapter.js';

require('dotenv').config();

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
    this.accountSelectorRef = React.createRef();

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      backendAddress: "",
      imageHostAddress: "",
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

  handleAccountSelect(option) {
    if (option === 'create-new') {
      if (this.state.backendAddress !== '') {
        var newName = prompt("New account name");
        if (newName !== null && newName !== "") {
          createAccount(newName, this.state.backendAddress, function() {
            listUsers(this.state.backendAddress, (users) => {
              this.setState({'users': users});
              this.accountSelectorRef.current.value = newName;

              getUserContent(newName, this.state.backendAddress, function(content){
                this.setState(
                  {
                    'username': newName,
                    'content': content
                  }
                );
              }.bind(this));
            })
          }.bind(this));
        }
      }
    } else if (option !== '') {
      var username = option;
      getUserContent(username, this.state.backendAddress, function(content){
        this.setState(
          {
            'username': username,
            'content': content
          }
        );
      }.bind(this));
    }
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

    var noGridContent = (
      <div className='empty-content'>
        Please connect backend and select an account
      </div>
    );

    return (
      <div>
        <div className="top-bar">
          <span className='account-select'>
            Account:
            <select
              ref={this.accountSelectorRef}
              onChange={(e) => this.handleAccountSelect(e.target.value)}
            >
              <option value=''>None selected</option>
              {this.state.users.map(username =>
                (<option key={username} value={username}>{username}</option>)
              )}
              <option value='create-new'>+ New account</option>
            </select>
          </span>
          <span className="top-bar-right">
            Backend Address:
            <input
            type="text"
            onKeyDown={
              function(e){
                if (e.keyCode === ENTER_KEY) {
                  var backendAddress = e.target.value + ':' + (process.env.REACT_APP_BACKEND_PORT_BASE);
                  var imageHostAddress = e.target.value + ':' + (parseInt(process.env.REACT_APP_BACKEND_PORT_BASE) + 1);
                  this.setState(
                    {
                      'backendAddress': backendAddress,
                      'imageHostAddress': imageHostAddress
                    }
                  );
                  listUsers(backendAddress, function(users){
                    this.setState({'users':users})
                  }.bind(this));
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
        {this.state.backendAddress !== null && this.state.username !== '' ? gridContent : noGridContent}
      </div>
    );
  }
}

export default App;
