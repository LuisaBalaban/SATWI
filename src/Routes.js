import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './App';
import Login from './components/Login';
import UserInterface from './components/UserInterface';
import BoardConfig from './components/BoardConfig'
import Board from './components/Board'
import UserProfile from './components/UserProfile';
import Error from './components/Error'

function Routes() {
  return (
    <div className="App">

     <Router>
       <div>
        <Route path="/" exact component={App} />
        </div>  
        <Route path="/login" component={Login} />
        <Route path="/search" component={UserInterface} />
        <Route path="/board" component={Board} />
        <Route path='/board-config' component={BoardConfig}/>
        <Route path='/error' component={Error}/>
        <Route path='/profile' component={UserProfile}/>
     </Router>
     
    </div>
  );
}

export default Routes;