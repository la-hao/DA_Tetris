import React from 'react';
import Tetris from './components/Tetris';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
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