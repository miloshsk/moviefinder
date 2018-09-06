const MovieCtrl = (function() {
	const data = {
		url: 'http://www.omdbapi.com/?apikey=e99e23f5&s=',
		movies: [],
		favorites: [],
		titleSize: 36
	}
	return {
		getDataFromApi(url) {
			return new Promise(function(resolve, reject) {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.onload = function() {
					if(xhr.status === 200) {
						let json = JSON.parse(xhr.responseText);
		// Rewrite data movies array
						data.movies = json.Search;
		// Create elements from data movies array
						resolve(data.movies);
					} else {
		// Show error message
						reject(error);
					}
				};
		// Show error message
				xhr.onerror = function(error) {
					reject(error);
				}
				xhr.send();
			});
		},
		getData() {
			return data;
		}
	}
})();
const UICtrl = (function() {
	const UISelectors = {
		errorMessage: '.message-error',
		favoritesList: '.favorites-list',
		movieList: '.movies-list',
		movieSearchForm: '.movies-search',
		movieSearchInput: '.movies-search-field',
		movieItem: '.movie-item',
		moviesSearchlabel: '.movies-search-label',
		sortByNameInput: '#sort-name',
		sortByYearInput: '#sort-year',
		sortInputs: '.movie-sort',
		showFavoritesBtn: '.favorites',
		wrapper: '.wrapper'
	}
	const UIstringList = {
		addFavoritesBtn: 'favorite-btn-add',
		errorMessage: 'Already in list',
		errorMessageClassName: 'message-error',
		favoriteBtnText: 'Favorites',
		goToImbdHref: 'https://www.imdb.com/title/',
		linkToImbdText: 'IMBD',
		movieItem: 'movie-item',
		moviesSearchLabelActive: 'movies-search-label-active',
		movieItemPoster: 'movie-item-poster',
		moviesItesInfo: 'movie-item-info',
		removeFromFavoriteBtn: 'favorite-btn-remove',
		watchFavoritesBtn: 'favorites',
		watchSearchResultBtnText: 'search result'

	}
	return {
		blurSearchInput() {
			document.querySelector(UISelectors.movieSearchInput).blur();
		},
		clearMoviesSearchValue() {
			document.querySelector(UISelectors.movieSearchInput).value = '';
		},
		clearMovieSortValue() {
			document.querySelectorAll(UISelectors.sortInputs).forEach(function(item) {
				item.checked = false;
			})
		},
		clearMoviesList(elem) {
			while(elem.firstChild) {
				elem.removeChild(elem.firstChild);
			}
		},
		createMovieItem(movie, parentElem, buttonClassName, titleSize) {
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

			const link = document.createElement('a');
			link.href = `${UIstringList.goToImbdHref}${movie.imdbID}`;
			link.appendChild(document.createTextNode(UIstringList.linkToImbdText));
			infoWrapper.appendChild(link);

			const title = document.createElement('h2');
			if(movie.Title.length > titleSize) {
				title.appendChild(document.createTextNode(movie.Title.slice(0, titleSize) + '...'));
			} else {
				title.appendChild(document.createTextNode(movie.Title));
			}
			infoWrapper.appendChild(title);

			const year = document.createElement('span');
			year.appendChild(document.createTextNode(movie.Year));
			infoWrapper.appendChild(year);

			const favoriteBtn = document.createElement('button');
			favoriteBtn.classList.add(...buttonClassName);
			favoriteBtn.appendChild(document.createTextNode(UIstringList.favoriteBtnText));
			infoWrapper.appendChild(favoriteBtn);
			
			movieItem.appendChild(infoWrapper);
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
		moviesSearchLabelToggle() {
			if(this.value) {
				document.querySelector(UISelectors.moviesSearchlabel).classList.add(UIstringList.moviesSearchLabelActive);
			} else  {
				document.querySelector(UISelectors.moviesSearchlabel).classList.remove(UIstringList.moviesSearchLabelActive);
			}
		},	
		showErrorNothingFound() {
			let error = document.createElement('h2');
			error.appendChild(document.createTextNode('Nothing found'));
			document.querySelector(UISelectors.movieList).appendChild(error);
		},
		showErrorFavorites() {
			const error = document.createElement('div');
			error.classList.add(UIstringList.errorMessageClassName);
			error.appendChild(document.createTextNode(UIstringList.errorMessage));
			if(!document.querySelector(UISelectors.errorMessage)) {
				document.body.appendChild(error);
			} else {
				return false;
			}
			setTimeout(function() {
				error.remove();
			}, 1500)
		},
		toggleFavoritesList(e) {
			e.preventDefault();
			this.classList.toggle('favorites-show');
			if(this.classList.contains('favorites-show')) {
				document.querySelector(UISelectors.movieList).style.display = 'none';
				document.querySelector(UISelectors.favoritesList).style.display = 'flex';
				this.textContent = UIstringList.watchSearchResultBtnText;
			} else {
				document.querySelector(UISelectors.movieList).style.display = 'flex';
				document.querySelector(UISelectors.favoritesList).style.display = 'none';
				this.textContent = UIstringList.watchFavoritesBtn;
			}
		}
	}
})();
const App = (function(MovieCtrl, UICtrl) {
	//Get selectors from UICtrl
	const UISelectors = UICtrl.getSelectors();
	//Get list of strings
	const UIstringList = UICtrl.getStringList();
	//Get data
	const Data = MovieCtrl.getData();

	const loadEventListeners = function() {
		//Event on form submit
		document.querySelector(UISelectors.movieSearchForm).addEventListener('submit', function(e) {
			e.preventDefault();
			const url = `${MovieCtrl.getData().url}${UICtrl.getMovieSearchValue()}`;
		// Clear movies list
			UICtrl.clearMoviesList(document.querySelector(UISelectors.movieList));
			MovieCtrl.getDataFromApi(url)
		// Create element inside list of movies
				.then(createMoviesList)
				.then(UICtrl.moviesSearchLabelToggle)
				.then(UICtrl.blurSearchInput)
		// Show error message
				.catch(UICtrl.showErrorNothingFound);
		// Clear input values
		UICtrl.clearMovieSortValue();
		UICtrl.clearMoviesSearchValue();
		});

		document.querySelector(UISelectors.sortByNameInput).addEventListener('change', UICtrl.moviesSortByName);

		document.querySelector(UISelectors.sortByYearInput).addEventListener('change', UICtrl.moviesSortByYear);

		document.querySelector(UISelectors.showFavoritesBtn).addEventListener('click',UICtrl.toggleFavoritesList);

		document.querySelector(UISelectors.wrapper).addEventListener('click', toggleFavotiteMovie);

		document.querySelector(UISelectors.movieSearchInput).addEventListener('input', UICtrl.moviesSearchLabelToggle);

	}


	const createMoviesList = function(movies) {
		let name = ['btn', 'favorite-btn-add'];
		movies.forEach(function(movie){
			UICtrl.createMovieItem(movie, UISelectors.movieList, name, Data.titleSize);
	})}
	const createFavoriteList = function(movies) {
		let name = ['btn', 'favorite-btn-add', 'favorite-btn-remove'];
		movies.forEach(function(movie){
			UICtrl.createMovieItem(movie, UISelectors.favoritesList, name, Data.titleSize);
	});
	}
	const toggleFavotiteMovie = function(e) {
		// Get list of movies
		const moviesList = MovieCtrl.getData().movies;
		//Get list of favorite movies
		const favoriteMovies = MovieCtrl.getData().favorites;
		//Get title of clicked item
		let movieTitle;
		const checkMovieRepeat = function(item) {
			return item.Title === movieTitle;
		}

		// Check click target
		if(e.target.classList.contains(UIstringList.addFavoritesBtn)) {
		// Check if target contains remove class name
			if(e.target.classList.contains(UIstringList.removeFromFavoriteBtn)) {
		// Set movieTitle from data-title
				movieTitle = e.target.closest(UISelectors.movieItem).dataset.title;
		// Go through favorite movies list
				favoriteMovies.forEach( function(item, i) {
		// Check if target title equal to favorite item title
					if(movieTitle === item.Title) {
		// Remove favorite item title
						favoriteMovies.splice(i, 1);
					}
		// Remove element from DOM
					e.target.closest(UISelectors.movieItem).remove();
				});
			} else {
		// If target don't contains remove class name
				movieTitle = e.target.closest(UISelectors.movieItem).dataset.title;
		// Go through list of movies
				moviesList.forEach( function(item) {
		// Check if titles are equal
					if(item.Title === movieTitle) {
		// CHeck if titles are not repeat
						if(!favoriteMovies.some(checkMovieRepeat)) {
		// Push item in favorites
							favoriteMovies.push(item);
		// Clear and recreate elements including new favorite item
							UICtrl.clearMoviesList(document.querySelector(UISelectors.favoritesList));
							createFavoriteList(favoriteMovies);
						} else {
							UICtrl.showErrorFavorites();
						}
		
					}
				});
			} 
		} 
	}	

	return {
		init() {
			loadEventListeners();
		}
	}
})(MovieCtrl, UICtrl);

App.init();