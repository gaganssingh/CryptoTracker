"use strict";

// API Keys for coinlayer and newsapi
const cryptoKey = "9c4387f84eba763603c845c574f84888";
const newsKey = "b9e9d3186ce24713b6d5f1d2b5211acc";

// base URLs for coinlayer and newsapi
const cryptoBaseUrl = "https://api.coinlayer.com/api/live";
const newsBaseUrl = "https://newsapi.org/v2/everything";

// format and add relevant query items to the base urls
// used later in the getLivePrice and getLatestNews functions
function formatQueryParams(params) {
	const queryItems = Object.keys(params).map(
		(key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
	);
	return queryItems.join("&");
}

// display relevent crypto pricing in the DOM
function displayLivePrice(responseJson) {
	// deleting/hiding items displayed during previous search
	$("#current-price").empty();
	$("#js-crypto-error-message").text("");
	$(".current-price").addClass("hidden");
	$(".footer").addClass("hidden");
	// grab name of fiat currency from the response
	const cryptoName = Object.keys(responseJson.rates);
	const cryptoValue = Number(Object.values(responseJson.rates)).toFixed(2);
	// display price in the DOM
	$("#current-price").append(
		`<h2>1 ${cryptoName} = ${responseJson.target} ${cryptoValue}</h2>
        `
	);
	// unhide items so that items are displayed in the DOM
	$("#news").removeClass("hidden");
	$(".current-price").removeClass("hidden");
	$(".footer").removeClass("hidden");
}

// display relevent news articles in the DOM
function displayNews(responseJson) {
	// deleting/hiding items displayed during previous search
	$("#js-news-error-message").text("");
	$("#news-section-title").empty();
	$("#news-list").empty();
	if (responseJson.articles.length < 10) {
		$("#news-section-title").text("Sadly, no news articles available. Please select a different cryptocurrency.");
	} else {
		$("#news-section-title").text("Latest News");
		// display 10 articles in the DOM
		for (let i = 0; i < 10; i++) {
			$("#news-list").append(`
            <li class="news-block"><h3>${responseJson.articles[i].title}</h3>
            <p>By: ${responseJson.articles[i].author}</p>
            <p>Source: ${responseJson.articles[i].source.name}</p>
            <a href="${responseJson.articles[i].url}" target="_blank">Read Article</a>
            </li>
            `);
		}
	}
}

function getLivePrice(searchTerm, currency) {
	// query items to be added to the base URL
	const cryptoParams = {
		access_key : cryptoKey,
		target     : currency,
		symbols    : searchTerm
	};
	// join base URL with query items
	const queryString = formatQueryParams(cryptoParams);
	const url = cryptoBaseUrl + "?" + queryString;
	// getting data from the API
	fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then((responseJson) => displayLivePrice(responseJson))
		.catch((error) => {
			$("#js-crypto-error-message").text(
				`Opps! There's something wrong with getting the price. Please try again later. ERROR MESSAGE: ${error.message}`
			);
		});
}

function getLatestNews(newsSearchTerm) {
	// query items to be added to the base URL
	const newsParams = {
		q        : newsSearchTerm,
		language : "en"
	};
	// join base URL with query items
	const queryString = formatQueryParams(newsParams);
	const url = newsBaseUrl + "?" + queryString;
	const options = {
		headers : new Headers({
			"X-Api-Key" : newsKey
		})
	};
	// getting data from the API
	fetch(url, options)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then((responseJson) => displayNews(responseJson))
		.catch((error) => {
			$("#js-news-error-message").text(
				`Opps! There's something wrong with getting the news. Please try again later. ERROR MESSAGE: ${error.message}`
			);
		});
}

function watchForm() {
	$("form").submit((event) => {
		event.preventDefault();
		// for coinlayer api
		const searchTerm = $("#js-crypto").val();
		const selectedCurrency = $("#js-fiat").val();
		// generate searchterm for newsapi
		const newsSearchTerm = `${$("#js-crypto option:selected").text()} cryptocurrency`;
		getLivePrice(searchTerm, selectedCurrency);
		getLatestNews(newsSearchTerm);
	});
}

$(watchForm);
