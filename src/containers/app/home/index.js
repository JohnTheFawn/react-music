import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import ArtistCard from '../../../components/artistCard';
import ColoredHr from '../../../components/coloredHr';
import '../../../styles/main.css';

class Home extends React.Component {
  constructor(props, context){
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getToken = this.getToken.bind(this);

    this.state = {
      searchTerm: '',
      token: '',
      artists: []
    };
  }

  getSearchTerm(){
    return this.state.searchTerm;
  }

  handleChange(e) {
    this.setState({ searchTerm: e.target.value });
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

  handleSubmit(e) {
    e.preventDefault();
    let searchTerm = this.state.searchTerm;
    this.setState({ artists: [] });

    if(searchTerm){
      this.setState({ searching: true });

      this.getToken().then((token) => {

        let searchUrl = 'https://api.spotify.com/v1/search';
        searchUrl += '?q=' + encodeURIComponent(searchTerm);
        searchUrl += '&type=artist';

        $.get({
          url: searchUrl,
          headers: {
            Authorization: 'Bearer ' + token
          },
        }).done((res) => {
          if(res){
            this.setState({ artists: res.artists.items });
          }
          this.setState({ searching: false });
        });
      });
    }
  }

  render(){
    return (
      <Grid>

        <Row>
          <Col xs={12}>
            <form onSubmit={this.handleSubmit}>
              <FormControl
                disabled={this.state.searching}
                type="text"
                placeholder="Search for an Artist"
                value={this.state.searchTerm}
                onChange={this.handleChange}
              />
            </form>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="center">
            <Button onClick={this.handleSubmit} bsStyle="primary" style={{ marginTop: '19px' }}>
              <Glyphicon glyph="search"/> Search
            </Button>
          </Col>
        </Row>

        <ColoredHr/>

        <Row>
          <Col xs={12} className="center">
            {this.state.artists.map((artist) =>
              <Link to={`/artist/${artist.id}`} key={artist.id}>
                <ArtistCard artist={artist}/>
              </Link>
            )}
          </Col>
        </Row>

      </Grid>
    );
  }
};

export default Home;
