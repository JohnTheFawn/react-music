import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import HomePage from './home';
import ArtistPage from './artist';
import NotFoundPage from './not-found';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';



const App = () => (
  <div>
    <Navbar inverse collapseOnSelect fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">
            <Glyphicon glyph="headphones"/> React Music
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/" exact={true}>
            <NavItem>
              Home
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <main style={{ marginBottom: '20px' }}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/artist">
          <Route path="/artist/:id" component={ArtistPage} key={this.id} />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </main>
  </div>
);

export default App;
