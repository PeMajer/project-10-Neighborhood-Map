import React, { Component } from 'react';
import './App.css';
import Map from './Map';

class App extends Component {

  componentWillMount() {
    window.initMap = this.initMap;

  }

  initMap() {
    let map = new window.google.maps.Map(document.querySelector('#map'), {
      center: {"lat": 50.0516587, "lng": 14.4070306},
      zoom: 13,
      mapTypeControl: false
    });

  }

  hambClick() {
    const target = document.querySelector('aside')
    target.classList.toggle('show')
  }

  render() {
    return (
      <div className="App">
        <header>
          <button className='hamburger' onClick={() => this.hambClick()} >&#9776; </button>
          <h1>  Mapa </h1>
        </header>
        <aside>
          FILTER
        </aside>
        <main>
          <Map />
        </main>
      </div>
    );
  }
}

export default App;
