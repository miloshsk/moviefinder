const MovieCtrl = (function() {
	const data = {
		url: 'http://www.omdbapi.com/?apikey=e99e23f5&s=',
		movies: [],
		favorites: []
	}
	return {
		getDataFromApi(url) {
			return new Promise(function(resolve, reject) {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.onload = function() {
					if(xhr.status === 200) {
						let json = JSON.parse(xhr.responseText);
				// Rewrite movies arr
						data.movies = json.Search;
						resolve(data.movies);
					} else {
						reject();
					}
				};
				xhr.onerror = function(error) {
					reject(error);
				}
				xhr.send();
			});
		},
		getUrl() {
			return data.url;
		},
		getDataMovies() {
			return data.movies;
		},
		getDataFavorites() {
			return data.favorites;
		}
	}
})();
const UICtrl = (function() {
	const UISelectors = {
		wrapper: '.wrapper',
		movieList: '.movies-list',
		movieSearchForm: '.movies-search',
		movieSortBtns: '.movie-sort',
		movieSearchInput: '.movies-search-field',
		sortByNameInput: '#sort-name',
		sortByYearInput: '#sort-year',
		sortInputs: '.movie-sort',
		showFavoritesBtn: '.favorites',
		favoritesList: '.favorites-list',
		movieItem: '.movie-item'
	}
	const UIstringList = {
		movieItemPoster: 'movie-item-poster',
		moviesItesInfo: 'movie-item-info',
		addFavoritesBtn: 'favorite-btn',
		movieItem: 'movie-item',
		favoriteBtnText: 'Add to favorites',
		removeFromFavoriteBtn: 'remove-btn',
		removeFromFavoriteText: 'Remove from favorite',
		goToImbdText: 'Go to IMBD',
		goToImbdHref: 'https://www.imdb.com/title/'
	}
	return {
		createMovieItem(movie, parentElem) {
			const movieItem =document.createElement('li');
			movieItem.classList.add(UIstringList.movieItem);
			movieItem.dataset.title = `${movie.Title}`;
			movieItem.dataset.year = `${movie.Year.substr(0,4)}`;
			document.querySelector(parentElem).appendChild(movieItem);

			const imgWrapper = document.createElement('div');
			imgWrapper.classList.add(UIstringList.movieItemPoster);
			movieItem.appendChild(imgWrapper);

			const img = document.createElement('img');
			img.src = movie.Poster;
			imgWrapper.appendChild(img);

			const infoWrapper = document.createElement('div');
			infoWrapper.classList.add(UIstringList.moviesItesInfo);

			const favoriteBtn = document.createElement('button');
			favoriteBtn.classList.add(UIstringList.addFavoritesBtn);
			favoriteBtn.appendChild(document.createTextNode(UIstringList.favoriteBtnText));
			infoWrapper.appendChild(favoriteBtn);

			const removeFromFavoriteBtn = document.createElement('button');
			removeFromFavoriteBtn.classList.add(UIstringList.removeFromFavoriteBtn);
			removeFromFavoriteBtn.appendChild(document.createTextNode(UIstringList.removeFromFavoriteText));
			infoWrapper.appendChild(removeFromFavoriteBtn);

			const title = document.createElement('h2');
			title.appendChild(document.createTextNode(movie.Title));
			infoWrapper.appendChild(title);

			const year = document.createElement('span');
			year.appendChild(document.createTextNode(movie.Year));
			infoWrapper.appendChild(year);

			const link = document.createElement('a');
			link.href = `${UIstringList.goToImbdHref}${movie.imdbID}`;
			link.appendChild(document.createTextNode(UIstringList.goToImbdText));
			infoWrapper.appendChild(link);
			
			movieItem.appendChild(infoWrapper);

		},
		clearMoviesSearchValue() {
			document.querySelector(UISelectors.movieSearchInput).value = '';
		},
		clearMoviesList(elem) {
			while(elem.firstChild) {
				elem.removeChild(elem.firstChild);
			}
		},
		getMovieSearchValue() {
			return document.querySelector(UISelectors.movieSearchInput).value;
		},
		getSelectors() {
			return UISelectors;
		},
		getStringList() {
			return UIstringList;
		},
		showError() {
			let error = document.createElement('h2');
			error.appendChild(document.createTextNode('Nothing found'));
			document.querySelector(UISelectors.movieList).appendChild(error);
		},
		moviesSortByName() {
			Array.from(document.querySelectorAll(UISelectors.movieItem)).sort(function(a,b) {
				return (a.dataset.title > b.dataset.title) -  (a.dataset.title < b.dataset.title)
			}).forEach(function(elem, i) {
				elem.style.order = i;
			});
		},
		moviesSortByYear() {
			Array.from(document.querySelectorAll(UISelectors.movieItem)).sort(function(a,b) {
				return a.dataset.year - b.dataset.year
			}).forEach(function(elem, i) {
				elem.style.order = i;
			});
		},
		clearMovieSortValue() {
			document.querySelectorAll(UISelectors.sortInputs).forEach(function(item) {
				item.checked = false;
			})
		},
		toggleFavoritesList(e) {
			e.preventDefault();
			this.classList.toggle('favorites-show');
			if(this.classList.contains('favorites-show')) {
				document.querySelector(UISelectors.movieList).style.display = 'none';
				document.querySelector(UISelectors.favoritesList).style.display = 'flex';
			} else {
				document.querySelector(UISelectors.movieList).style.display = 'flex';
				document.querySelector(UISelectors.favoritesList).style.display = 'none';
			}
		}
	}
})();
const App = (function(MovieCtrl, UICtrl) {
	//Get selectors from UICtrl
	const UISelectors = UICtrl.getSelectors();
	//Get list of strings
	const UIstringList = UICtrl.getStringList();

	const loadEventListeners = function() {
		//Event on form submit
		document.querySelector(UISelectors.movieSearchForm).addEventListener('submit', function(e) {
			e.preventDefault();
		// Clear movies list
			UICtrl.clearMoviesList(document.querySelector(UISelectors.movieList));
			const url = `${MovieCtrl.getUrl()}${UICtrl.getMovieSearchValue()}`;
			MovieCtrl.getDataFromApi(url)
		// Create element inside list of movies
				.then(createMoviesList)
		// Clear input values
				.then(UICtrl.clearMovieSortValue)
				.then(UICtrl.clearMoviesSearchValue)
		// Show error message
				.catch(UICtrl.showError);
		});

		document.querySelector(UISelectors.sortByNameInput).addEventListener('change', UICtrl.moviesSortByName);

		document.querySelector(UISelectors.sortByYearInput).addEventListener('change', UICtrl.moviesSortByYear);

		document.querySelector(UISelectors.showFavoritesBtn).addEventListener('click',UICtrl.toggleFavoritesList);

		document.querySelector(UISelectors.wrapper).addEventListener('click', addFavotiteMovie);

		document.querySelector(UISelectors.wrapper).addEventListener('click', removeFromFavorites);

	}

	const createMoviesList = function(movies) {
		movies.forEach(function(movie){
			UICtrl.createMovieItem(movie, UISelectors.movieList);
	})}
	const createFavoriteList = function(movies) {
		movies.forEach(function(movie){
			UICtrl.createMovieItem(movie, UISelectors.favoritesList);
	})}
	const addFavotiteMovie = function(e) {
		// Get list of movies
		const moviesList = MovieCtrl.getDataMovies();
		//Get list of favorite movies
		const favoriteMovies = MovieCtrl.getDataFavorites();
		//Get title of clicked item
		let movieTitle;
		const checkMovieRepeat = function(item) {
			return item.Title === movieTitle;
		}
		// Check click target
		if(e.target.classList.contains(UIstringList.addFavoritesBtn)) {
				movieTitle = e.target.closest(UISelectors.movieItem).dataset.title;
		// Go through list of movies
				moviesList.forEach( function(item) {
		// Check if titles are equal and don't repeat
					if(item.Title === movieTitle && !favoriteMovies.some(checkMovieRepeat)) {
		// Push item in favorites
						favoriteMovies.push(item);
					}
				});
			} else {
				return false;
			}
			UICtrl.clearMoviesList(document.querySelector(UISelectors.favoritesList));
			createFavoriteList(favoriteMovies);
	}

	const removeFromFavorites = function(e) {
		// Get list of movies
		const moviesList = MovieCtrl.getDataMovies();
		//Get list of favorite movies
		const favoriteMovies = MovieCtrl.getDataFavorites();
		//Get title of clicked item
		let movieTitle;
		if(e.target.classList.contains(UIstringList.removeFromFavoriteBtn)) {
			let movieTitle = e.target.closest(UISelectors.movieItem).dataset.title;
			favoriteMovies.forEach( function(item, i) {
				if(movieTitle === item.Title) {
					favoriteMovies.splice(i, 1);
				}
			});
		}
		UICtrl.clearMoviesList(document.querySelector(UISelectors.favoritesList));
		createFavoriteList(favoriteMovies);
	}	

	return {
		init() {
			loadEventListeners();
		}
	}
})(MovieCtrl, UICtrl);

App.init();