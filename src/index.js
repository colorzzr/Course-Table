import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'

// import App from './components/rootWorkFlow/App';
// import Autocomplete from './components/autoComplete/App';
// import SearchUI from './components/test/Search';
import Classic from './course';
// import No_tag from './components/classic/no_tag_filter';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Classic} />
    </div>
  </Router>
)


ReactDOM.render(routing, document.querySelector('#root'));

