import React from 'react';
import { Route, Link } from 'react-router-dom';
import HomePage from '../home';
import ComponentPage from '../components';
import ArtistPage from '../artist';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const App = () => (
  <div>
    <Navbar inverse collapseOnSelect fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">
            React Music
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
          <LinkContainer to="/components">
            <NavItem>
              Components
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <main>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/components" component={ComponentPage} />
      <Route exact path="/artist" component={ArtistPage} />
    </main>
  </div>
);

export default App;
