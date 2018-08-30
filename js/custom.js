const MovieCtrl = (function() {
	const data = {
		url: 'http://www.omdbapi.com/?apikey=e99e23f5&s='
	}
	return {
		getData(url) {
			return new Promise(function(resolve, reject) {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.onload = function() {
					if(xhr.status === 200) {
						let json = JSON.parse(xhr.responseText);
						resolve(json.Search);
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
		}
	}
})();
const UICtrl = (function() {
	const UISelectors = {
		movieList: '.movies-list',
		movieSearchForm: '.movies-search',
		movieSortBtns: '.movie-sort',
		movieItem: '.movie-item',
		movieSearchInput: '.movies-search-field',
		movieItemPoster: '.movie-item-poster',
		moviesItesInfo: '.movie-item-info',
		sortByNameInput: '#sort-name',
		sortByYearInput: '#sort-year',
		sortInputs: '.movie-sort'
	}
	return {
		createMovieItem(movie) {
			const movieItem =document.createElement('li');
			movieItem.classList.add(UISelectors.movieItem.substring(1));
			movieItem.dataset.title = `${movie.Title.toLowerCase()}`;
			movieItem.dataset.year = `${movie.Year.substr(0,4)}`;
			document.querySelector(UISelectors.movieList).appendChild(movieItem);

			const imgWrapper = document.createElement('div');
			imgWrapper.classList.add(UISelectors.movieItemPoster.substring(1));
			movieItem.appendChild(imgWrapper);

			const img = document.createElement('img');
			img.src = movie.Poster;
			imgWrapper.appendChild(img);

			const infoWrapper = document.createElement('div');
			infoWrapper.classList.add(UISelectors.moviesItesInfo.substring(1));

			const title = document.createElement('h2');
			title.appendChild(document.createTextNode(movie.Title));
			infoWrapper.appendChild(title);

			const year = document.createElement('span');
			year.appendChild(document.createTextNode(movie.Year));
			infoWrapper.appendChild(year);

			const link = document.createElement('a');
			link.href = "https://www.imdb.com/title/" + movie.imdbID;
			link.appendChild(document.createTextNode('Go to IMBD'));
			infoWrapper.appendChild(link);
			
			movieItem.appendChild(infoWrapper);

		},
		clearMoviesList() {
			const elem = document.querySelector(UISelectors.movieList);
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
		}
	}
})();
const App = (function(MovieCtrl, UICtrl) {

	const loadEventListeners = function() {
		const UISelectors = UICtrl.getSelectors();
		document.querySelector(UISelectors.movieSearchForm).addEventListener('submit', function(e) {
			e.preventDefault();
			UICtrl.clearMoviesList();
			const url = `${MovieCtrl.getUrl()}${UICtrl.getMovieSearchValue()}`;
			MovieCtrl.getData(url)
				.then(function(movies){
					movies.forEach(function(movie){
						UICtrl.createMovieItem(movie)
					}
				)})
				.then(UICtrl.clearMovieSortValue)
				.catch(UICtrl.showError);
		});

		document.querySelector(UISelectors.sortByNameInput).addEventListener('change', UICtrl.moviesSortByName);

		document.querySelector(UISelectors.sortByYearInput).addEventListener('change', UICtrl.moviesSortByYear);
	}

	return {
		init() {
			loadEventListeners();
		}
	}
})(MovieCtrl, UICtrl);

App.init();