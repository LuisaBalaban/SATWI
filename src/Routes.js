import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './App';
import Login from './components/Login';
import UserInterface from './components/UserInterface';
import BoardConfig from './components/BoardConfig'
import Board from './components/Board'


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
        {/* <Route path='/board-stats' component={Board}/> */}

     </Router>
     
    </div>
  );
}

export default Routes;