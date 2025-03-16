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

///////////////////////////////////////
/// movie detail template
///////////////////////////////////////

// render template html for selected movie (takes all movieDetail as input)
const movieTemplate = (movieDetail) => {

  // convert text values -> numerical data for comparison
  const dollars = movieDetail.BoxOffice
    ? `$${parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')).toLocaleString()}`
    : 'N/A';

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

    <article data-value="${awards}" class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.Awards}</h4>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value="${dollars}" class="notification is-primary is-rounded">
      <h4 class="title is-4">${dollars}</h4>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value="${metascore}" class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.Metascore}</h4>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value="${imdbRating}" class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.imdbRating}</h4>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value="${imdbVotes}" class="notification is-primary is-rounded">
      <h4 class="title is-4">${movieDetail.imdbVotes}</h4>
      <p class="subtitle">IMDB Votes</p>
    </article>
`;

};

///////////////////////////////////////
/// fetch movie details + run comparison
///////////////////////////////////////


// initialize left and right movies
let leftMovie;
let rightMovie;

// fetch single movie details on select (based on imdbID)
const onMovieSelect = async (movie, summaryArea, side) => {
  const response = await axios.get('https://omdbapi.com/', {
    params: {
      apikey: import.meta.env.VITE_OMDB_API_KEY,
      'i': movie.imdbID
    }
  });
  console.log(response.data)
  // inject the fetched movie data into summary area
  summaryArea.innerHTML = movieTemplate(response.data);

  // store corresponding movie data for both sides
  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  };

  // run a comparison only when both movies have been selected
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

// func to run the comparison using the both sides stats
const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  // loop over left stats to compare corresponding values from right side
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    // use dataset.value for data-value attributes
    const leftValue = parseFloat(leftStat.dataset.value);
    const rightValue = parseFloat(rightStat.dataset.value);

    // style lower-ranked stat in yellow
    if (rightValue > leftValue) {
      leftStat.classList.replace('is-primary', 'is-warning');
    } else {
      rightStat.classList.replace('is-primary', 'is-warning');
    };
  });
};

// initialize left autocomplete
createAutoComplete({
  // use shared autocomplete configurations
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'), // attach to left input
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); // fetch + display details in left
  }
});

// initialize right autocomplete
createAutoComplete({
  // use shared autocomplete configurations
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'), // attach to right input
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right'); // fetch + display details in right
  }
});