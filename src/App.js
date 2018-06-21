import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import Filter from './Filter';
import escapeRegExp from 'escape-string-regexp';

class App extends Component {
  constructor(props) {
    super(props)
    this.initMap = this.initMap.bind(this)
    //this.openInfo = this.openInfo.bind(this)
  }

  state = {
    places: '',
    map: {},
    infoWindow: {},
    markers: [],
    query: ''
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
      zoom: 12,
      mapTypeId: 'roadmap'
    })

    this.setState({map: map})
    this.setMarkers(map,this.state.places)

    let infoWindow = new window.google.maps.InfoWindow();
    this.setState({infoWindow: infoWindow})
  }

  setMarkers = (map,places) => {
    let markers = []
    let bounds = new window.google.maps.LatLngBounds()

    this.setState({bounds: bounds})

    places.map((place) => {
      let marker = new window.google.maps.Marker({
        position: place.position,
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
  }

  hideMarkers = (markers=this.state.markers) => {
    markers.map(marker => {
      marker.setMap(null)
      return ''
    })
  }

  showMarkers = (markers=this.state.markers) => {
    markers.map(marker => {
      marker.setMap(this.state.map)
      if (marker.isAnimated) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
      }
      return ''
    })
  }

  offAnimation() {
    this.state.markers.map(marker => marker.isAnimated = false)
  }

  openInfo = (marker) => {
    let infoWindow = this.state.infoWindow
    this.offAnimation()

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

  updateQuery = (que) => {
    this.setState({ query: que.trim() })

    this.offAnimation()

    let info = this.state.infoWindow
    info.marker = null
    this.setState({infoWindow: info})
    this.state.infoWindow.close()
  }

  listItemClick = (markerId) => {
    for (const marker of this.state.markers) {
      marker.isAnimated = false

      if (marker.id === markerId) {
        this.openInfo(marker)
        marker.isAnimated = true
      }
    }
  }

  hambClick() {
    const target = document.querySelector('aside')
    target.classList.toggle('show')
  }

  render() {
    let showingPlaces;

    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingPlaces = this.state.markers.filter((marker) => match.test(marker.title))
      this.hideMarkers()
      this.showMarkers(showingPlaces)
    } else {
      showingPlaces = this.state.markers
      this.showMarkers(this.state.markers)
    }




    return (
      <div className="App">
        <header>
          <button className='hamburger' onClick={() => this.hambClick()} >&#9776; </button>
          <h1>  Mapa </h1>
        </header>
        <aside>
          <Filter markers={showingPlaces} onUpdateQuery={this.updateQuery} onListItemClick={this.listItemClick} />
        </aside>
        <main>
          <Map />
        </main>
      </div>
    );
  }
}

export default App;
