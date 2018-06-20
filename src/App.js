import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import Filter from './Filter';

class App extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
    //this.openInfo = this.openInfo.bind(this);
  }

  state = {
    places: '',
    map: {},
    infoWindow: {},
    markers: []
  }

  componentWillMount() {
    this.loadPlaces()
    window.initMap = this.initMap

  }

  loadPlaces() {
    fetch('./places.json')
      .then(res => res.json())
      .then(resJSON => this.setState({ places: resJSON.places }))
      .catch(err => console.log(err))
  }

  initMap() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {"lat": 50.0516587, "lng": 14.4070306},
      zoom: 13,
      mapTypeId: 'roadmap'
    })
    map = this.setMarkers(map,this.state.places)
    this.setState({map: map})

    let infoWindow = new window.google.maps.InfoWindow();
    this.setState({infoWindow: infoWindow})
  }

  setMarkers = (map,places) => {
    let markers = []
    let bounds = new window.google.maps.LatLngBounds()

    places.map((place) => {
      let marker = new window.google.maps.Marker({
        position: place.position,
        map: map,
        title: place.name,
        animation: window.google.maps.Animation.DROP,
        id: place.googleId
      })
      marker.addListener('click', () => {
        this.openInfo(marker)
      })
      bounds.extend(marker.position)
      markers.push(marker)
      return ''
    })
    map.fitBounds(bounds)
    this.setState({markers: markers})
    return map
  }

  hideMarkers = (markers=this.state.markers) => {
    markers.map(marker => {
      marker.setMap(null)
      return ''
    })
  }

  openInfo = (marker) => {
    let infoWindow = this.state.infoWindow

    if (infoWindow.marker !== marker) {
      infoWindow.setContent('')
      infoWindow.marker = marker
      infoWindow.addListener('closeclick', function () {
        infoWindow.marker = null
      })
      infoWindow.setContent('<div>' + marker.title + '</div>')
      infoWindow.open(this.state.map, marker)
      this.setState({infoWindow: infoWindow})
    }
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
          <Filter markers={this.state.markers} />
        </aside>
        <main>
          <Map />
        </main>
      </div>
    );
  }
}

export default App;
