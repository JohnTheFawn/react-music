import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import $ from 'jquery';
import '../../../styles/main.css';
import './style.css';
import CommaSeparatedNumber from '../../../helpers/commaSeparatedNumber';
import ConvertMillisecondsToFriendly from '../../../helpers/convertMillisecondsToFriendly';
import AlbumCard from '../../../components/albumCard';
import ArtistCard from '../../../components/artistCard';
import ColoredHr from '../../../components/coloredHr';
import Loader from '../../../components/loader';
import TrackInfo from '../../../components/trackInfo';

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
    this.topTracksWrapper = this.topTracksWrapper.bind(this);
    this.albumsWrapper = this.albumsWrapper.bind(this);
    this.relatedArtistsWrapper = this.relatedArtistsWrapper.bind(this);

    this.trackModalContent = this.trackModalContent.bind(this);
    this.selectTrack = this.selectTrack.bind(this);
    this.closeTrackInfoModal = this.closeTrackInfoModal.bind(this);

    this.state = {
      artistId: props.match.params.id,
      artist: null,
      albums: [],
      topTracks: [],
      relatedArtists: [],
      token: null,

      artistLoading: false,
      albumsLoading: false,
      topTracksLoading: false,
      relatedArtistsLoading: false,

      showTrackInfoModal: false,
      selectedTrack: null,
      selectedTrackUrl: null
    };

  }

  componentDidMount(){
    this.lookupArtist();
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

    this.setState({ artistLoading: true });

    this.getToken().then((token) => {

      let searchUrl = 'https://api.spotify.com/v1/artists';
      searchUrl += '/' + artistId;

      $.get({
        url: searchUrl,
        headers: {
          Authorization: 'Bearer ' + token
        },
      }).done((res) => {
        this.setState({ artistLoading: false });

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

    this.setState({ topTracksLoading: true });

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

        this.setState({ topTracksLoading: false });

        if(res){
          this.setState({ topTracks: res.tracks });
        }
      });
    });
  }

  lookupAlbums(){
    let artistId = this.state.artistId;

    this.setState({ albumsLoading: true });

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

        this.setState({ albumsLoading: false });

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

    this.setState({ relatedArtistsLoading: true });

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

        this.setState({ relatedArtistsLoading: false });

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

  openSpotify(e, url){
    if(url){
      window.open(url);
    }
  }

  searchYoutube(e, track){
    if(track){
      let youtubeUrl = 'https://www.youtube.com/results?search_query=';

      let artists = '';
      for(var i = 0; i < track.artists.length; i++){
        if(i > 0){
          artists += ' and ';
        }
        artists += track.artists[i].name;
      }

      youtubeUrl += track.name + ' by ' + artists;
      window.open(youtubeUrl);
    }
  }

  topTracksWrapper(){
    if(this.state.topTracksLoading){
      return (
        <div style={{ paddingTop: '19px' }}>
          <Loader/>
        </div>
      );
    }
    else{
      return (
        <Table hover>
          <tbody>
            {this.state.topTracks.map((topTrack) =>
              <tr key={topTrack.id} className="pointer accent-color-onHover" onClick={e => this.selectTrack(e, topTrack)}>
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
      );
    }
  }

  selectTrack(e, track){
    this.setState({ selectedTrack: track });
    this.setState({ selectedTrackUrl: track.external_urls.spotify });
    this.setState({ showTrackInfoModal: true });
  }

  closeTrackInfoModal(){
    this.setState({ showTrackInfoModal: false });
  }

  albumsWrapper(){
    if(this.state.albumsLoading){
      return (
        <div style={{ paddingTop: '19px' }}>
          <Loader/>
        </div>
      );
    }
    else{
      return (
        this.state.albums.map((album) =>
          <AlbumCard key={album.id} album={album}/>
        )
      );
    }
  }

  relatedArtistsWrapper(){
    if(this.state.relatedArtistsLoading){
      return (
        <div style={{ paddingTop: '19px' }}>
          <Loader/>
        </div>
      );
    }
    else{
      return (
        this.state.relatedArtists.map((relatedArtist) =>
          <Link to={`/artist/${relatedArtist.id}`} key={relatedArtist.id}>
            <ArtistCard artist={relatedArtist}/>
          </Link>
        )
      );
    }
  }

  trackModalContent(){
    if(this.state.selectedTrack){
      return (
        <TrackInfo track={this.state.selectedTrack} />
      )
    }
    else{
      return null;
    }
  }

  render(){

    const artist = this.state.artist;
    let imageUrl = 'url(' + PlaceholderImage + ')';

    if(artist){
      if(artist.images[0]){
        imageUrl = 'url(' + artist.images[0].url + ')';
      }

      return (
        <div>
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
                    {this.topTracksWrapper()}

                    <ColoredHr/>

                    <h3>
                      Albums ({this.state.albums.length})
                    </h3>
                    <div className="center" style={{whiteSpace: "initial"}}>
                      {this.albumsWrapper()}
                    </div>

                    <ColoredHr/>

                    <h3>
                      Related Artists
                    </h3>
                    <div className="center" style={{whiteSpace: "initial"}}>
                      {this.relatedArtistsWrapper()}
                    </div>

                  </div>
                </div>
              </Col>
            </Row>
          </Grid>

          <Modal show={this.state.showTrackInfoModal} onHide={this.closeTrackInfoModal} bsSize="large">
            <Modal.Body>
              {this.trackModalContent()}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={e => this.searchYoutube(e, this.state.selectedTrack)} bsStyle="danger">
                <Glyphicon glyph = "new-window" /> Search Youtube
              </Button>
              <Button onClick={e => this.openSpotify(e, this.state.selectedTrackUrl)} bsStyle="success">
                <Glyphicon glyph = "new-window" /> Open in Spotify
              </Button>
              <Button onClick={this.closeTrackInfoModal} bsStyle="primary">Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
    return null;
  }
};

export default Artist;
