import PropTypes from 'prop-types';

/**
* @description load/fetch data from Foursquare
* @param {array} places
*/
export function fetchFourSquare (places) {
  const clientId = 'LL4UNDUA21U3BS4NRKJ1YZ3PI0ZRTNCOK4QW0E2STF51U0SX'    // FREE account - daily quota
  const clientSecret = 'NUVCYT5FIODESPB0EB4GZ3BEZAM43GHXVJPX0HYYH0YJA4G1'
  const url = 'https://api.foursquare.com/v2/venues/'
  const ver = '20180323'

  places.map(place => {
    const placeId = place.id
    let urlRequest = `${url}${placeId}?client_id=${clientId}&client_secret=${clientSecret}&v=${ver}`

    fetch(urlRequest, {
        method: 'GET'
      }).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText ? response.statusText : response.status === 429 ? 'Daily call quota exceeded.' : 'Unknown error.' )
        }
        return response.json()
      }).then((data) => {
        place.data = data.response.venue
        this.setState({
          places: this.state.places.filter((p) => p.id !== place.id).concat([ place ])
        })
      }).catch(err => console.log(err))
    return ''
  })
}

fetchFourSquare.propTypes = {
  places: PropTypes.array
}