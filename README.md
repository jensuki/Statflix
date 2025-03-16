# Statflix
A movie comparison tool that lets users enter two separate films and see which one dominates based on stats like box office, IMDB rating, and awards

## [Live Demo](https://stat-flix.vercel.app)

## Features
- **Compare two movies head-to-head**
- **Pulls movie data from OMDB API**
- **Highlights better stats in green, weaker ones in yellow**

## How to Use
1. Type a movie name in the left autocomplete search box
2. Type another movie in the right autocomplete search box
3. Compare the stats instantly!

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (ES6)
- **Styling**: Bulma
- **API & Libraries**: Axios, [OMDB API](https://omdbapi.com/)
- **Build Tool**: Vite
- **Hosting**: Vercel

## Local Installation & Setup
To run Statflix locally:

### **Clone the Repository**
```sh
git clone https://github.com/jensuki/statflix.git
cd statflix
```
### **Install Dependencies**
```sh
npm install
```

### **Set up Environment Variables**
1. Create a `.env` file in the project root
2. Include your OMDB API key in the file:
`VITE_OMDB_API_KEY=your_api_key_here`
3. Run `npm run dev`
- This will start the app locally at [localhost](http:/localhost:5173)


