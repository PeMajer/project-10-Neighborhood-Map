import React, { Component } from 'react';
import SortBy from 'sort-by';
import PropTypes from 'prop-types';

export class Filter extends Component {
  static propTypes = {
    onUpdateQuery: PropTypes.func.isRequired,
    onListItemClick: PropTypes.func.isRequired,
    query: PropTypes.string,
    markers: PropTypes.array.isRequired
  }

  render() {
    this.props.markers.sort(SortBy('title'))
    return (
      <div>
        <input
          tabIndex={4}
          className='filter-places'
          type='text'
          placeholder='Filter places'
          value={this.props.query}
          onChange={(event) => this.props.onUpdateQuery(event.target.value )}
        />
        <ul>
          {this.props.markers.map(marker =>
            <li key={marker.id}
              onClick={() => this.props.onListItemClick(marker.id) }
              role="button"
              tabIndex={5}
              onKeyUp={event =>
                (event.keyCode === 13) ? this.props.onListItemClick(marker.id) : ''
                }>
              {marker.title}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Filter


