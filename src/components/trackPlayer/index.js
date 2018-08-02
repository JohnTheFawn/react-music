import React from 'react';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';
import './style.css';
import '../../styles/main.css';

import PlaceholderImage from './placeholder-image.png';

class TrackPlayer extends React.Component {

  constructor(props, context){
    super(props, context);

    this.setupAudioEvents = this.setupAudioEvents.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.pauseTrack = this.pauseTrack.bind(this);

    this.state = {
      audioId: new Date().getTime(),
      track: props.track,

      audioPlaying: false,
      audioProgress: 0,
      audioCurrentTime: '00:00',
      audioEndTime: '00:00'
    }
  }

  componentDidMount(){
    this.setupAudioEvents();
  }

  setupAudioEvents(){
    var me = this;
    let audioPlayer = $('#' + this.state.audioId)[0];
    if(audioPlayer){

      window.audioPlayer = audioPlayer;

      audioPlayer.ontimeupdate = function(){
        me.setState({ audioProgress: audioPlayer.currentTime / audioPlayer.duration * 100});
        me.setState({
          audioCurrentTime: me.convertTimeToFriendly(audioPlayer.currentTime)
        });
      }

      audioPlayer.onloadeddata = function(){
        me.setState({
          audioEndTime: me.convertTimeToFriendly(audioPlayer.duration),
          audioDuration: audioPlayer.duration
        });
      }
    }
  }

  convertTimeToFriendly(seconds){
    let roundedSeconds = Math.round(seconds);

    let minutes = 0;
    if(roundedSeconds > 60){
      minutes = Math.floor(roundedSeconds / 60);
    }

    if(minutes < 10){
      minutes = '0' + minutes;
    }
    if(roundedSeconds < 10){
      roundedSeconds = '0' + roundedSeconds;
    }

    return minutes + ':' + roundedSeconds;
  }

  getPlayPauseButton(){
    let audioPlayer = $('#' + this.state.audioId)[0];
    if(audioPlayer){
      if(!this.state.audioPlaying || audioPlayer.paused){
        return (
          <Button onClick={e => this.playTrack(e)} style={{ borderRadius: '50%', width: '39px', height: '39px' }}>
            <Glyphicon className="accent-color" glyph="play" />
          </Button>
        );
      }
      return (
        <Button onClick={e => this.pauseTrack(e)} style={{ borderRadius: '50%', width: '39px', height: '39px' }}>
          <Glyphicon className="accent-color" glyph="pause" />
        </Button>
      );
    }
  }

  playTrack(e){
    let audioPlayer = $('#' + this.state.audioId)[0];

    audioPlayer.play();

    this.setState({ audioPlaying: true });
  }

  pauseTrack(e){
    let audioPlayer = $('#' + this.state.audioId)[0];

    audioPlayer.pause();

    this.setState({ audioPlaying: false });
  }

  getAlbumArt(){
    let track = this.state.track;
    if(track.album){
      if(track.album.images){
        let image = track.album.images[0];

        return (
          <img className="track-player-albumart" src={image.url} alt="Album Art"/>
        );
      }
    }
    return (
      <img className="track-player-albumart" src={PlaceholderImage} alt="Album Art"/>
    );
  }

  render(){
    const track = this.state.track;
    if(track){

      const url = track.preview_url;
      if(url){

        return(
          <div>
            <audio id={this.state.audioId} src={url} />

            <div className="track-player">

              <div>
                {this.state.audioCurrentTime}
                <span className="pull-right">
                  {this.state.audioEndTime}
                </span>
              </div>

              <ProgressBar className="track-player-progressBar" now={this.state.audioProgress} />

              <div className="track-player-body">
                {this.getAlbumArt()}
                <div className="track-player-album-info">
                  <div title="Album">
                    {this.state.track.album.name}
                  </div>
                  <div title="Release Date">
                    {this.state.track.album.release_date}
                  </div>
                </div>
                <div className="track-player-buttons">
                  {this.getPlayPauseButton()}
                </div>
              </div>

            </div>
          </div>
        )

      }
    }

    return null;
  }
};

export default TrackPlayer;
