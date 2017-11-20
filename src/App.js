import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MorseNode from './morse.js'
//import './audio_modulation.js'

class App extends Component {
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      <AudioButton />
      </div>
    );
  }
}


class AudioButton extends Component{
  constructor(props){
    super(props);
    this.playAudio=this.playAudio.bind(this);
    this.initAudio=this.initAudio.bind(this);
    this.startAudio=this.startAudio.bind(this);
    this.stopAudio=this.stopAudio.bind(this);
    this.create=this.create.bind(this);
    this.update=this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {char : ""};
    this.baseChar = '.';
}

  create(){
    this.baseChar = '.'
    setTimeout( x => {this.baseChar = '-'}, 500)
    console.log(this.baseChar)
  }

  update(){
    this.setState({
      char: this.state.char+this.baseChar
    });
    console.log(this.state.char)
  }

  reset(){
    this.setState({
      char: ""
    });
  }
  initAudio() {
    this.context = new window.AudioContext()
    this.m = new MorseNode(this.context, 2)
    console.log(this.context.destination)
    this.m.connect(this.context.destination)
  }

  playAudio(c) {
    console.log(c)
    this.m.playChar(this.context.currentTime,c)
  }

  startAudio(){
    console.log(this)
    this.m.playSound(this.context.currentTime)
    this.create()
  }

  stopAudio(){
    this.m.stopPlaying(this.context.currentTime)
    this.update()
    this.context.close()
  }

  render(){
    this.initAudio()
    return(
    <div>
      <button onMouseDown={this.startAudio} onMouseUp={this.stopAudio}>press to type</button>
      <button onClick={x => this.playAudio(this.state.char)}>I replay what you typed</button>
      <button onClick={this.reset}>reset</button>
      <Text text={this.state.char}/>

    </div>
    );
  }
}

class Text extends Component{
  render(){
    console.log(this.props)
    return(
      <p>you typed: {this.props.text}</p>
    );
  }
}

class Recorder extends Component{

  render(){

    var b = document.querySelector("button");
    var clicked = false;
    var recording = false;
    var chunks = [];
    var ac = new AudioContext();
    var osc = ac.createOscillator();
    var dest = ac.createMediaStreamDestination();
    var mediaRecorder = new MediaRecorder(dest.stream);
    osc.connect(dest);

    function record(e){
      if(!recording){
        mediaRecorder.start();
        e.target.innerHTML = "Stop recording";
        recording = true;
      }
      else{
        mediaRecorder.requestData();
        mediaRecorder.stop();
      }
    }
    function click(e) {
      if (!clicked) {
          osc.start(0);
          clicked = true;
        } else {
          osc.stop(0);
          clicked = false;
        }
    };

    mediaRecorder.ondataavailable = function(evt) {
      // push each chunk (blobs) in an array
      chunks.push(evt.data);
    };

    mediaRecorder.onstop = function(evt) {
      // Make blob out of our blobs, and open it.
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      var audioTag = document.createElement('audio');
      document.querySelector("audio").src = URL.createObjectURL(blob);
    };

    return(
      <div>
        <p>Encoding a pure sine wave to an Opus file </p>
        <p><button onClick={click}> Make sine wave</button></p>
        <p><p onClick={record}>Start</p></p>
        <audio controls></audio>
      </div>
    );
  }
}


class Tapper extends Component{

  constructor(props){
    super(props);
    this.create=this.create.bind(this);
    this.update=this.update.bind(this);
    this.char = ""
    this.baseChar = '.'
}

  create(){
    this.baseChar = '.'
    setTimeout( x => {this.baseChar = '-'}, 500)
    //console.log(this.baseChar)
  }

  update(){
    console.log(this.baseChar)
    this.char = this.char + this.baseChar
    console.log(this.char)
  }

  reset(){
    this.char = ''
  }

  render(){
    return(
      <div>
        <button onMouseDown={x => this.create()} onMouseUp={this.update}>lala</button>
        <p>haha: {this.char}</p>
      </div>
    );
  }
}



var MorseExchange = {
  code: '',
  timeTyping: []
}

export default App;
