import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './App';
import Login from './components/Login';
import UserInterface from './components/UserInterface';
import BoardConfig from './components/BoardConfig'


function Routes() {
  return (
    <div className="App">

     <Router>
       <div>
        <Route path="/" exact component={App} />
        </div>  
        <Route path="/login" component={Login} />
        <Route path="/search" component={UserInterface} />
        <Route path='/board-config' component={BoardConfig}/>

     </Router>
     
    </div>
  );
}

export default Routes;