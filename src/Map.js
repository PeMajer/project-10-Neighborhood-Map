import React, {Component} from 'react';

class Map extends Component {

  componentWillMount() {
    window.gm_authFailure = () => alert("Error, check API key");
    const bodyTag = document.querySelector('body');
    let mapsTag = document.createElement('script');
    mapsTag.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCBr-4lNZOkFhaRjW_wkxMvvyxxBKpeDVQ&libraries=places,geometry,drawing&callback=initMap';
    mapsTag.onerror = () => alert("Error between loading Google Maps");
    mapsTag.async = true;
    mapsTag.defer = true;
    bodyTag.appendChild(mapsTag);
  }

  render() {
    return (
      <div id="map" role="application" aria-label="Map">Map is loading....</div>
    );
  }
}
export default Map;
