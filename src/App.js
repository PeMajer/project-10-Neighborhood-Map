import React, { Component } from 'react';
import Map from './Map';
import Filter from './Filter';
import escapeRegExp from 'escape-string-regexp';
import { fetchFourSquare } from './utils/fsAPI'

class App extends Component {
  constructor(props) {
    super(props)
    this.initMap = this.initMap.bind(this)
    this.closeInfo = this.closeInfo.bind(this)
  }

  state = {
    places: [],
    map: {},
    infoWindow: {},
    markers: [],
    query: ''
  }

  componentWillMount() {
    this.loadPlaces().then(places => fetchFourSquare.call(this,places))
  }

  componentDidMount() {
    window.initMap = this.initMap
  }

  componentDidUpdate() {
    const infoWindowEle = document.querySelector('.info')
    if (infoWindowEle !== null) {       // set target on infowindow
      setTimeout(function(){ infoWindowEle.focus() }, 1)
    }
  }

  /**
  * @description load/fetch places information from json files
  */
  loadPlaces() {
    return fetch('./places.json')
      .then(res => res.json())
      .then(resJSON => resJSON.places)
      .then(places =>  {
        this.setState({ places: places }) // initial loading places
        return places
      })
      .catch(err => console.log(err))
  }

  /**
  * @description initial google map
  */
  initMap() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {"lat": 50.0516587, "lng": 14.4070306},
      zoom: 9,
      mapTypeId: 'roadmap'
    })
    this.setState({map: map})
    this.setMarkers(map,this.state.places)
    let infoWindow = new window.google.maps.InfoWindow();
    this.setState({infoWindow: infoWindow})
  }

  /**
  * @description set map markers and bounds
  * @param {object} map
  * @param {array} places
  */
  setMarkers = (map,places) => {
    let markers = []
    let bounds = new window.google.maps.LatLngBounds()
    this.setState({bounds: bounds})

    places.map((place) => {
      let marker = new window.google.maps.Marker({
        position: place.position,
        title: place.name,
        animation: window.google.maps.Animation.DROP,
        id: place.id
      })
      marker.addListener('click', () => {
        this.openInfo(marker)
      })
      bounds.extend(marker.position)  // add marker into bounds
      markers.push(marker)
      return ''
    })
    map.fitBounds(bounds)    // set bounds
    this.setState({markers: markers})
  }

  /**
  * @description hide all markers
  * @param {array} markers
  */
  hideMarkers = (markers=this.state.markers) => {
    markers.map(marker => {
      marker.setMap(null)
      return ''
    })
  }

  /**
  * @description show all markers
  * @param {array} markers
  */
  showMarkers = (markers=this.state.markers) => {
    markers.map(marker => {
      marker.setMap(this.state.map)
      if (marker.isAnimated) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
      }
      return ''
    })
  }

  /**
  * @description show all markers
  * @param {object} markers
  */
  openInfo = (marker) => {
    let infoWindow = this.state.infoWindow
    this.offAnimation()   //cancel marker animation
    const placeData = this.state.places.filter(p => p.id === marker.id)  // find data for place/marker
    const fsData = placeData[0].data
    // if click on same infowindows dont open again
    if (infoWindow.marker !== marker) {
      infoWindow.setContent('')   // delete infowindow content
      infoWindow.marker = marker
      infoWindow.addListener('closeclick', this.closeInfo)
      let innerHTML = `<article class="info" role="article" tabindex="2">`
      if (fsData) {
        fsData.name ? innerHTML += `<h2>${fsData.name}</h2>` : innerHTML += `<h2>${marker.title}</h2>`
        innerHTML += `<button class="close-infowindow" tabindex="2" aria-label="Close information"> X </button>`
        fsData.location.formattedAddress ? innerHTML += `<p>${fsData.location.formattedAddress.join(', ')}</p>` : innerHTML += ``
        fsData.contact.formattedPhone ? innerHTML += `<p>Phone: ${fsData.contact.formattedPhone}</p>` : innerHTML += ``
        fsData.url ? innerHTML += `<p>Web site: <a tabindex="2" href="${fsData.url}">${fsData.url}</a></p>` : innerHTML += ``
        fsData.shortUrl ? innerHTML += `<p> <a tabindex="2" href="${fsData.shortUrl}">More details</a></p>` : innerHTML += ``
        innerHTML += `<p> Data provided by Foursquare</p>`
      } else {
        innerHTML += `<h2>${marker.title}</h2>`
        innerHTML += `<button class="close-infowindow" tabindex="2" aria-label="Close information"> X </button><p> Can't load data from Foursquare </p>`
      }
      innerHTML += '</article>'
      infoWindow.setContent(innerHTML)
      infoWindow.open(this.state.map, marker)
      this.setState({infoWindow: infoWindow})
      document.querySelector('.close-infowindow').addEventListener('click',() => { // close button for web reader
        this.closeInfo()
        document.querySelector('.filter-places').focus()  // focus on filter element
      })
    }
  }

  /**
  * @description cancel markers animation
  */
  offAnimation() {
    this.state.markers.map(marker => marker.isAnimated = false)
  }

  /**
  * @description close infowindow
  */
  closeInfo() {
    this.offAnimation()
    let info = this.state.infoWindow
    info.marker = null
    this.setState({infoWindow: info})
    this.state.infoWindow.close()
  }

  /**
  * @description update query from places filter
  * @param {string} querry - string from filter input
  */
  updateQuery = (que) => {
    this.setState({ query: que.trim() })
    this.offAnimation()
    this.closeInfo()
  }

  /**
  * @description open infowindow when click on place in list
  * @param {string} markerId - marker ID
  */
  listItemClick = (markerId) => {
    for (const marker of this.state.markers) {
      marker.isAnimated = false
      if (marker.id === markerId) {
        this.openInfo(marker)
        marker.isAnimated = true
      }
    }
  }

  /**
  * @description show nav vwhen click on hanburger icon
  */
  hambClick() {
    const target = document.querySelector('nav')
    target.classList.toggle('show')
  }

  render() {
    let showingPlaces // variables for fitering places
    if (this.state.query) {   // places filtering
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      showingPlaces = this.state.markers.filter((marker) => match.test(marker.title))
      this.hideMarkers()
      this.showMarkers(showingPlaces)
    } else {
      showingPlaces = this.state.markers  // set all places
      this.showMarkers(this.state.markers)
    }
    return (
      <div className="App">
        <header role='banner'>
          <div className='hamburger'><button tabIndex={-1} className='hamburger-icon' onClick={() => this.hambClick()} >&#9776; </button></div>
          <h1> <a tabIndex={1} href='/'> Neighborhood Map </a></h1>
        </header>
        <nav>
          <Filter markers={showingPlaces} onUpdateQuery={this.updateQuery} onListItemClick={this.listItemClick} query={this.state.query} />
        </nav>
        <main role="main">
          <Map />
        </main>
      </div>
    );
  }
}

export default App;
