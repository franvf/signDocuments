import React, { Component } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './Header';
import Index from './Index';
import Admin from './Admin';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {

  render(){
    return(
      <BrowserRouter>
        <container>
          <Header />
          <main>
            <Routes>
              <Route exact path="/" element={<Index />}/>
              <Route exact path="/admin" element = {<Admin />} />
            </Routes>
          </main>
        </container>
      </BrowserRouter>
    );
  }

}

export default App;
