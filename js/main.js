document.addEventListener('DOMContentLoaded', function() {	
	let movieList = document.querySelector('.movies-list');
	let form = document.querySelector('.movies-search');

	function addMovieToList(movie) {
		let item = document.createElement('li');
		item.classList.add('movies-item');
		movieList.appendChild(item);

		let imgWrapper = document.createElement('div');
		imgWrapper.classList.add('movies-item-poster');
		item.appendChild(imgWrapper);

		let img = document.createElement('img');
		img.src = movie.Poster;
		imgWrapper.appendChild(img);

		let infoWrapper = document.createElement('div');
		infoWrapper.classList.add('movies-item-info');

		let title = document.createElement('h2');
		title.appendChild(document.createTextNode(movie.Title));
		infoWrapper.appendChild(title);

		let year = document.createElement('span');
		year.appendChild(document.createTextNode(movie.Year));
		infoWrapper.appendChild(year);

		let link = document.createElement('a');
		link.href = "https://www.imdb.com/title/" + movie.imdbID;
		link.appendChild(document.createTextNode('Go to IMBD'));
		infoWrapper.appendChild(link);
		
		item.appendChild(infoWrapper);
		
	}
	function clearList(elem) {
		while(elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	}

	function showError() {
		let errorTitle = document.createElement('h2');
		errorTitle.appendChild(document.createTextNode('Nothing found'));
		movieList.appendChild(errorTitle);
	}

	function getData(url) {
		return new Promise(function(resolve, reject) {
			let xhr = new  XMLHttpRequest();
			xhr.open('GET', url);
			xhr.onload = function() {
				if(xhr.status === 200) {
					let json = JSON.parse(xhr.response);
					resolve(json.Search);
				} else {
					reject();
				}
			};
			xhr.onerror = function(error) {
				reject(error);
			}
			xhr.send()
		})
	}
	form.addEventListener('submit',function(e) {
		e.preventDefault();
		let input = document.querySelector('.movies-search-field');
		getData(`http://www.omdbapi.com/?apikey=e99e23f5&s=${input.value}`)
			.then(function(movies) { 
				movies.forEach(function(movie){ 
						addMovieToList(movie)}
					)})
			.then(clearList(movieList))
			.catch(showError);
	})
});


