import React, { Component } from "react";
import click1 from "../audio/click1.wav";
import click2 from "../audio/click2.wav";
import * as audioContextTimers from "audio-context-timers";
import "./Metronome.css";

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      count: 0,
      bpm: 120,
      beatsPerMeasure: 4
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  startStop = () => {
    if (this.state.playing) {
      //stops timer
      audioContextTimers.clearInterval(this.timer);
      this.setState({
        playing: false
      });
    } else {
      //starts timer with current bpm
      this.timer = audioContextTimers.setInterval(
        this.playClick,
        (60 / this.state.bpm) * 1000
      );
      this.setState(
        {
          count: 0,
          playing: true
          //plays a click "immediately" (after setState finishes)
        },
        this.playClick
      );
    }
  };

  playClick = () => {
    const { count, beatsPerMeasure } = this.state;

    //The first beat will have a different sound that the others
    if (count % beatsPerMeasure === 0) {
      this.click2.play();
    } else {
      this.click1.play();
    }

    //Keep track of which beat we're on
    this.setState(state => ({
      count: (state.count + 1) % state.beatsPerMeasure
    }));
  };

  handleBpmChange = event => {
    const bpm = event.target.value;

    if (this.state.playing) {
      //stop the old timer and start a new one
      audioContextTimers.clearInterval(this.timer);
      this.timer = audioContextTimers.setInterval(
        this.playClick,
        (60 / bpm) * 1000
      );
      //Set the new bpm, and reset the beat counter
      this.setState({
        count: 0,
        bpm
      });
    } else {
      //otherwise just update the bpm
      this.setState({ bpm });
    }
  };

  handleTimeChange = event => {
    if (event.target.value <= 20 && event.target.value >= 1) {
      this.setState({
        beatsPerMeasure: event.target.value
      });
    } else {
      //disableInput should eliminate the need for this
      alert("Please select a value between 1 & 20");
      this.setState({
        beatsPerMeasure: 4
      });
    }
  };

  disableInput = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  componentWillUnmount = () => {
    audioContextTimers.clearInterval(this.timer);
    this.setState({
      playing: false,
      count: 0,
      bpm: 100,
      beatsPerMeasure: 4
    });
  };

  render() {
    const { playing, bpm } = this.state;

    return (
      <div className="metronome">
        <h1>React Metronome</h1>
        <div className="time-signature">
          <fieldset>
            <legend>{this.state.beatsPerMeasure}/4 Time</legend>
            <input
              type="number"
              min="1"
              max="20"
              onKeyDown={this.disableInput}
              onChange={this.handleTimeChange}
            />
          </fieldset>
        </div>
        <br />
        <div className="bpm-slider">
          <fieldset>
            <legend>{bpm} BPM</legend>
            <input
              type="range"
              min="60"
              max="240"
              value={bpm}
              onChange={this.handleBpmChange}
            />
            <button onClick={this.startStop}>
              {playing ? "Stop" : "Start"}
            </button>
          </fieldset>
        </div>
      </div>
    );
  }
}

export default Metronome;
