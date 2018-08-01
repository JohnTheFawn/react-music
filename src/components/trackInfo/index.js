import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import $ from 'jquery';
import './style.css';
import '../../styles/main.css';
import ColoredHr from '../coloredHr';
import ConvertMillisecondsToFriendly from '../../helpers/convertMillisecondsToFriendly';
import { Doughnut } from 'react-chartjs-2';

import PlaceholderImage from './placeholder-image.png';

class ArtistCard extends React.Component {

  constructor(props, context){
    super(props, context);

    this.getToken = this.getToken.bind(this);

    this.lookupTrackInfo = this.lookupTrackInfo.bind(this);

    this.lookupTrackAudioAnalysis = this.lookupTrackAudioAnalysis.bind(this);
    this.trackAudioAnalysisWrapper = this.trackAudioAnalysisWrapper.bind(this);

    this.lookupTrackAudioFeatures = this.lookupTrackAudioFeatures.bind(this);
    this.trackAudioFeaturesWrapper = this.trackAudioFeaturesWrapper.bind(this);

    this.state = {
      track: props.track,

      trackInfoLoading: true,
      trackInfo: null,

      trackAudioAnalysisLoading: true,
      trackAudioAnalysis: null,

      trackAudioFeaturesLoading: true,
      trackAudioFeatures: null
    }
  }

  componentDidMount(){
    this.lookupTrackInfo();
  }

  getToken(){
    return new Promise((resolve, reject) => {
      if(this.state.token){
        resolve(this.state.token);
      }
      else{
        $.get(process.env.REACT_APP_API_URL + '/token')
        .done((response) => {
          this.setState({ token: response.token });
          resolve(response.token);
        })
        .fail(function(){
          reject();
        });
      }
    });
  }

  lookupTrackInfo(){
    let trackId = this.state.track.id;

    this.setState({ trackInfoLoading: true });

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/tracks';
      searchUrl += '/' + trackId;

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        this.setState({ trackInfoLoading: false });

        if(res){
          this.setState({ trackInfo: res });

          this.lookupTrackAudioAnalysis();
          this.lookupTrackAudioFeatures();
        }
      });
    });
  }

  lookupTrackAudioAnalysis(){
    let trackId = this.state.track.id;

    this.setState({ trackAudioAnalysisLoading: true });

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/audio-analysis';
      searchUrl += '/' + trackId;

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        this.setState({ trackAudioAnalysisLoading: false });

        if(res){
          this.setState({ trackAudioAnalysis: res });
        }
      });
    });
  }

  lookupTrackAudioFeatures(){
    let trackId = this.state.track.id;

    this.setState({ trackAudioFeaturesLoading: true });

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/audio-features';
      searchUrl += '/' + trackId;

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        this.setState({ trackAudioFeaturesLoading: false });

        if(res){
          this.setState({ trackAudioFeatures: res });
        }
      });
    });
  }

  trackAudioAnalysisWrapper(){
    if(this.state.trackAudioAnalysis){
      return (
        <div/>
      );
    }
    return null;
  }

  trackAudioFeaturesWrapper(){
    if(this.state.trackAudioFeatures){

      let audioFeatures = this.state.trackAudioFeatures;

      let backgroundColor = '#f2545b';

      let danceabilityData = {
        datasets: [{
          backgroundColor: [backgroundColor],
          data: [audioFeatures.danceability, 1 - audioFeatures.danceability]
        }]
      };

      let energyData = {
        datasets: [{
          backgroundColor: [backgroundColor],
          data: [audioFeatures.energy, 1 - audioFeatures.energy]
        }]
      };

      let loudnessData = {
        datasets: [{
          backgroundColor: [backgroundColor],
          data: [-60 + (audioFeatures.loudness * -1), audioFeatures.loudness]
        }]
      };

      let options = {
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        }
      };

      return (
        <div className="center">

          <div className="graph-card">
            <div className="graph-card-header">
              Danceability
            </div>
            <div className="graph-wrapper">
              <Doughnut data={danceabilityData} options={options}/>
            </div>
          </div>

          <div className="graph-card">
            <div className="graph-card-header">
              Energy
            </div>
            <div className="graph-wrapper">
              <Doughnut data={energyData} options={options}/>
            </div>
          </div>

          <div className="graph-card">
            <div className="graph-card-header">
              Loudness
            </div>
            <div className="graph-wrapper">
              <Doughnut data={loudnessData} options={options}/>
            </div>
          </div>
        </div>
      )
    }
    return null;
  }

  render(){
    const track = this.state.track;

    return(
      <Grid fluid>
        <Row>
          <Col sm={12}>
            <h1 className="accent-color extra-font">
              {track.name}
            </h1>
          </Col>
        </Row>

        <ColoredHr/>

        <Row>
          <Col sm={12}>
            {this.trackAudioFeaturesWrapper()}
          </Col>
        </Row>

      </Grid>
    )
  }
};

export default ArtistCard;
