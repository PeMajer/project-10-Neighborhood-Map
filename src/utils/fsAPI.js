export function fetchFourSquare (places) {
  const clientId = 'LL4UNDUA21U3BS4NRKJ1YZ3PI0ZRTNCOK4QW0E2STF51U0SX'
  const clientSecret = 'WUKYVCCZKA1YM3J43RG3AKMHIBSQXRPSXRMZVLCMT24GQL34'
  const url = 'https://api.foursquare.com/v2/venues/'
  const limit = 1
  const ver = '20180323'

  const self = this

  places.map(place => {
    const placeId = place.id
    let urlRequest = `${url}${placeId}?client_id=${clientId}&client_secret=${clientSecret}&v=${ver}&limit=${limit}`

    fetch(urlRequest, {
        method: 'GET'
      }).then(function (response) {
        if (!response.ok) {
          throw new Error(response.statusText ? response.statusText : 'Unknown error')
        }
        return response.json()
      }).then(function(data) {
        place.data = data.response.venue
        self.setState({
          places: self.state.places.filter((p) => p.id !== place.id).concat([ place ])
        })
      }).catch(err => console.log(err + ', maybe quota request exceeded'))
    return ''
  })
}