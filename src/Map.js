import React, {Component} from 'react';

class Map extends Component {

  componentWillMount() {
    // Loading the Maps JavaScript API
    window.gm_authFailure = () => alert("Error, check API key")
    const bodyEle = document.querySelector('body')
    let mapsEle = document.createElement('script')
    mapsEle.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCBr-4lNZOkFhaRjW_wkxMvvyxxBKpeDVQ&libraries=places,geometry,drawing&callback=initMap'
    mapsEle.onerror = () => alert("Error between loading Google Maps")
    mapsEle.async = true
    mapsEle.defer = true
    bodyEle.appendChild(mapsEle)
  }

  render() {
    return (
      <div id="map" role="application" aria-label="Map">Map is loading....</div>
    );
  }
}
export default Map;
