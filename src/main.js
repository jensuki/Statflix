import './utils.js';
import './autocomplete.js';
import axios from 'axios';


// core logic

///////////////////////////////////////
/// autcomplete configuration
///////////////////////////////////////

// config object for left + right autocomplete fields
const autoCompleteConfig = {

  // render individual movie option inside dropdown
  renderOption(movie) {
    // handle N/A images
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
  },

  // return the movie title when user selects an option
  inputValue(movie) {
    return movie.Title;
  },

  // fetch movie data from api (based on searchTerm)
  async fetchData(searchTerm) {
    const response = axios.get('http://omdbapi.com/', {
      params: {
        apikey: import.meta.env.VITE_OMDB_API_KEY,
        s: searchTerm
      }
    });

    return response.data.Error ? [] : response.data.Search;
  }
}