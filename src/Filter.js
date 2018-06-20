import React, { Component } from 'react'

export class Filter extends Component {


  render() {
    return (
      <div>
        <input
          className='filter-places'
          type='text'
          placeholder='Filter places'
          value={this.props.query}
          onChange={(event) => this.props.onUpdateQuery(event.target.value )}
        />
        <ul>
          {this.props.markers.map(marker =>
            <li key={marker.id}>
              {marker.title}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Filter


