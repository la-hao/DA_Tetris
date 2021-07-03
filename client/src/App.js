import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import Tetris from './components/Tetris';
import TetrisOnline from './components/TetrisOnline';

const App = () => {
  return (<div className="App">
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/normal" />
        </Route>
        <Route path="/normal" component={Tetris} />
        <Route path="/online" component={TetrisOnline}>
        </Route>
      </Switch>
    </Router>
  </div>)
};

export default App;