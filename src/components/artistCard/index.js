import React from 'react';
import './style.css';
import '../../styles/main.css';

import PlaceholderImage from './placeholder-image.png';

class ArtistCard extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      artist: props.artist
    }
  }

  render(){
    const artist = this.state.artist;

    let imageUrl = 'url(' + PlaceholderImage + ')';
    if(artist.images[0]){
      imageUrl = 'url(' + artist.images[0].url + ')';
    }

    return(
      <div className="artist-card item-card ellipsis" title={artist.name}>
        <div className="artist-image" style={ { backgroundImage: imageUrl}}>
        </div>
        <div className="artist-info">
          <b>{artist.name}</b>
        </div>
      </div>
    )
  }
};

export default ArtistCard;
