import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './style.css';
import '../../styles/main.css';

import PlaceholderImage from './placeholder-image.png';

class AlbumCard extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      album: props.album
    }
  }

  openSpotify(e, url){
    window.open(url);
  }

  render(){
    const album = this.state.album;

    if(album){
      let imageUrl = 'url(' + PlaceholderImage + ')';
      if(album.images[0]){
        imageUrl = 'url(' + album.images[0].url + ')';
      }

      return(
        <div className="album-card item-card ellipsis" title={album.name}>
          <div className="album-image" style={{ backgroundImage: imageUrl }}>
            <div className="hover-over pointer" style={{ textAlign: 'center' }} onClick={e => this.openSpotify(e, album.external_urls.spotify)}>
              <div style={{ height: '100%', width: '0px', verticalAlign: 'middle', display: 'inline-block' }} />
              <Glyphicon style={{ display: 'inlineBlock', verticalAlign: 'middle', fontSize: 75}} glyph="play-circle" className="accent-color"/>
            </div>
          </div>
          <div className="album-info">
            <b>{album.name}</b>
          </div>
        </div>
      )
    }
    return null;
  }
};

export default AlbumCard;
