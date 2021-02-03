import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import './App.css';
import RegisterScreen from './components/RegisterScreen';
import SigninScreen from './components/SigninScreen';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      Hello world</header>
      <main>
        <Route path="/signin" component={SigninScreen}></Route>
        <Route path="/register" component={RegisterScreen}></Route>
      </main>
    </div>
  );
}

export default App;
