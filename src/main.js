import createAutoComplete from './autocomplete.js';
import axios from 'axios';

///////////////////////////////////////
/// autcomplete configuration:
/// - how to display movie in dropdown
/// - controls what text appears in input field after selection
/// - fetches movie data
///////////////////////////////////////

// config object specifying the custom behavior for left + right autocomplete fields
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
    const response = await axios.get('https://omdbapi.com/', {
      params: {
        apikey: import.meta.env.VITE_OMDB_API_KEY,
        s: searchTerm
      }
    });

    return response.data.Error ? [] : response.data.Search;
  }
};

// initialize left autocomplete
createAutoComplete({
  // grab the config object properties
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'), // attach to left
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
  }
});

// initialize right autocomplete
createAutoComplete({
  // grab the config object properties
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'), // attach to right
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
  }
});

// render template html for selected movie (takes all movieDetail as input)
const movieTemplate = (movieDetail) => {

  // convert text values -> numerical data for comparison
  const dollars = movieDetail.BoxOffice
    ? parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replae(/,/g, ''))
    : 0;
  const metascore = parseInt(movieDetail.Metascore) || 0;
  const imdbRating = parseFloat(movieDetail.imdbRating) || 0;
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, '')) || 0;

  // calculate total awards won
  // if current value != number, just return the current total
  const awards = movieDetail.Awards
    ? movieDetail.Awards.split(' ').reduce((total, word) => {
      const value = parseInt(word);
      return isNaN(value) ? total : total + value;
    }, 0)
    : 0;

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.Awards}</h4>
      <p class="subtitle">Awards</p>
    </article>

    <article class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.BoxOffice}</h4>
      <p class="subtitle">Box Office</p>
    </article>

    <article class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.Metascore}</h4>
      <p class="subtitle">Metascore</p>
    </article>

    <article class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.imdbRating}</h4>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.imdbVotes}</h4>
      <p class="subtitle">IMDB Votes</p>
    </article>
`;

};