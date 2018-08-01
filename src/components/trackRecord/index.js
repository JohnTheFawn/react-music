import React from 'react';
import './style.css';
import '../../styles/main.css';

import PlaceholderImage from './placeholder-image.png';

class TrackRecord extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      track: props.track
    }
  }

  render(){
    const track = this.state.track;

    let imageUrl = 'url(' + PlaceholderImage + ')';
    if(track.album){
      if(track.album.images[0]){
        imageUrl = 'url(' + track.album.images[0].url + ')';
      }
    }

    return(
      <div className="track-card item-card ellipsis" title={track.name}>
        <div className="track-image" style={ { backgroundImage: imageUrl}}>
        </div>
        <div className="track-info">
          <b>{track.name}</b>
        </div>
      </div>
    )
  }
};

export default TrackRecord;
