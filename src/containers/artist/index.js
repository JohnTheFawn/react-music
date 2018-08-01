import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import $ from 'jquery';
import '../../styles/main.css';
import './style.css';

import PlaceholderImage from './placeholder-image.png';

class Artist extends React.Component {
  constructor(props, context){
    super(props, context);

    this.getToken = this.getToken.bind(this);
    this.lookupArtist = this.lookupArtist.bind(this);
    this.lookupTopTracks = this.lookupTopTracks.bind(this);
    this.lookupAlbums = this.lookupAlbums.bind(this);
    this.lookupRelatedArtists = this.lookupRelatedArtists.bind(this);

    this.state = {
      artistId: props.match.params.id,
      artist: null,
      albums: [],
      topTracks: [],
      relatedArtists: [],
      token: null
    };

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

  lookupArtist() {
    let artistId = this.state.artistId;
    this.setState({ searching: true });

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/artists';
      searchUrl += '/' + artistId;

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        if(res){
          this.setState({ artist: res });
          console.log(res);

          this.lookupTopTracks();
          this.lookupAlbums();
          this.lookupRelatedArtists();
        }
      });
    });
  }

  lookupTopTracks(){
    let artistId = this.state.artistId;

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/artists';
      searchUrl += '/' + artistId;
      searchUrl += '/top-tracks';
      searchUrl += '/?country=US';

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        if(res){
          this.setState({ topTracks: res.tracks });
          console.log('top tracks', res.tracks);
        }
      });
    });
  }

  lookupAlbums(){
    let artistId = this.state.artistId;

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/artists';
      searchUrl += '/' + artistId;
      searchUrl += '/albums';
      searchUrl += '?limit=50';

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        if(res){

          let alreadyMappedAlbums = {};
          let albums = [];
          for(var i = 0; i < res.items.length; i++){
            let album = res.items[i];
            if(!alreadyMappedAlbums[album.name] && albums.length < 10){
              albums.push(album);
              alreadyMappedAlbums[album.name] = true;
            }
          }

          this.setState({ albums: albums });
          console.log('albums', albums);
        }
      });
    });
  }

  lookupRelatedArtists(){
    let artistId = this.state.artistId;

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/artists';
      searchUrl += '/' + artistId;
      searchUrl += '/related-artists';
      searchUrl += '?limit=10';

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        if(res){
          let relatedArtists = [];
          for(var i = 0; i < res.artists.length; i++){
            let relatedArtist = res.artists[i];

            if(relatedArtists.length < 10){
              relatedArtists.push(relatedArtist);
            }
          }
          this.setState({ relatedArtists: relatedArtists });
          console.log('related artists', relatedArtists);
        }
      });
    });
  }

  componentDidMount(){
    this.lookupArtist();
  }

  render(){

    const artist = this.state.artist;
    let imageUrl = 'url(' + PlaceholderImage + ')';

    if(artist){
      if(artist.images[0]){
        imageUrl = 'url(' + artist.images[0].url + ')';
      }

      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <div className="artist-container item-card">
                <div className="artist-image" style={ { backgroundImage: imageUrl}}>
                </div>
                <div className="artist-info">
                  <h1>
                    {artist.name}
                    <span className="pull-right sub-title">
                      {artist.followers.total} Followers
                    </span>
                  </h1>

                  <hr/>

                  <h2>
                    Top Tracks
                  </h2>
                  {this.state.topTracks.map((topTrack) =>
                    <div key={topTrack.id}>
                      {topTrack.name}
                    </div>
                  )}

                  <hr/>

                  <h2>
                    Albums
                  </h2>
                  {this.state.albums.map((album) =>
                    <div key={album.id}>
                      {album.name}
                    </div>
                  )}

                  <hr/>

                  <h2>
                    Related Artists
                  </h2>
                  {this.state.relatedArtists.map((relatedArtist) =>
                    <div key={relatedArtist.id}>
                      {relatedArtist.name}
                    </div>
                  )}

                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      );
    }
    return null;
  }
};

export default Artist;
