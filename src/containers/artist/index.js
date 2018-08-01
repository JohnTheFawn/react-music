import React from 'react';
import { Grid, Row, Col, Table, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../../styles/main.css';
import './style.css';
import CommaSeparatedNumber from '../../components/commaSeparatedNumber';
import ColoredHr from '../../components/coloredHr';
import ConvertMillisecondsToFriendly from '../../components/convertMillisecondsToFriendly';
import AlbumCard from '../../components/albumCard';
import ArtistCard from '../../components/artistCard';

import PlaceholderImage from './placeholder-image.png';

class Artist extends React.Component {
  constructor(props, context){
    super(props, context);

    this.getToken = this.getToken.bind(this);
    this.lookupArtist = this.lookupArtist.bind(this);
    this.lookupTopTracks = this.lookupTopTracks.bind(this);
    this.lookupAlbums = this.lookupAlbums.bind(this);
    this.lookupRelatedArtists = this.lookupRelatedArtists.bind(this);
    this.openSpotify = this.openSpotify.bind(this);

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
      searchUrl += '&include_groups=album,single';

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
            if(!alreadyMappedAlbums[album.name]){
              albums.push(album);
              alreadyMappedAlbums[album.name] = true;
            }
          }

          this.setState({ albums: albums });
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
        }
      });
    });
  }

  componentDidMount(){
    this.lookupArtist();
  }

  openSpotify(e, url){
    window.open(url);
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
                    <span className="pointer underline accent-color" onClick={e => this.openSpotify(e, artist.external_urls.spotify)} title="Open in Spotify">
                      {artist.name}
                    </span>
                    <span className="pull-right sub-title">
                      <CommaSeparatedNumber
                        value={artist.followers.total}
                      /> Followers
                    </span>
                  </h1>

                  <ColoredHr/>

                  <h3>
                    Top Tracks
                  </h3>
                  <Table hover>
                    <tbody>
                      {this.state.topTracks.map((topTrack, index) =>
                        <tr key={topTrack.id} className="pointer accent-color-onHover" onClick={e => this.openSpotify(e, topTrack.external_urls.spotify)} title="Open in Spotify">
                          <td style={{width: 25}}>
                            <Glyphicon style={{fontSize: 18}} glyph="play-circle" />
                          </td>
                          <td>
                            {topTrack.name}
                          </td>
                          <td style={{textAlign: 'right'}}>
                            <ConvertMillisecondsToFriendly value={topTrack.duration_ms} />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <ColoredHr/>

                  <h3>
                    Albums ({this.state.albums.length})
                  </h3>
                  <div className="center" style={{whiteSpace: "initial"}}>
                    {this.state.albums.map((album) =>
                      <AlbumCard key={album.id} album={album}/>
                    )}
                  </div>

                  <ColoredHr/>

                  <h3>
                    Related Artists
                  </h3>
                  <div className="center" style={{whiteSpace: "initial"}}>
                    {this.state.relatedArtists.map((relatedArtist) =>
                      <Link to={`/artist/${relatedArtist.id}`} key={relatedArtist.id}>
                        <ArtistCard artist={relatedArtist}/>
                      </Link>
                    )}
                  </div>

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
