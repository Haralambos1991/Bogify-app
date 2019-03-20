import React, { Component } from 'react';
import './SearchList.css';


class SearchList extends Component {
  state = {
      query: '',
  }

  handleInputChange = () => {
      this.setState({
        query: this.search.value  
      })
    }

    render() {
    return(
        <form>
        <input
        placeholder="Search for Songs, Artists or Albums"
        ref={input => this.search = input}
        onChange={this.handleInputChange}
        />
        <p>{this.state.query}</p>
        </form>
    )
    }
}

export default SearchList;