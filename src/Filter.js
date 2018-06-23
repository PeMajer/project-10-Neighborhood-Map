import React, { Component } from 'react';
import SortBy from 'sort-by';

export class Filter extends Component {
  render() {
    this.props.markers.sort(SortBy('title'))

    return (
      <div>
        <input
          role="search"
          aria-label="Search place from places list"
          className='filter-places'
          type='text'
          placeholder='Search places'
          value={this.props.query}
          onChange={(event) => this.props.onUpdateQuery(event.target.value )}
        />
        <ul>
          {this.props.markers.map(marker =>
            <li key={marker.id}
              onClick={() => this.props.onListItemClick(marker.id) }
              role="link"
              tabIndex={0}
              onKeyUp={event =>
                (event.keyCode === 13) ? this.props.onListItemClick(marker.id) : ''
                } >
              {marker.title}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Filter


