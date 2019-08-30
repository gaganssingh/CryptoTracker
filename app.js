"use strict";

const cryptoKey = "9c4387f84eba763603c845c574f84888";
const newsKey = "b9e9d3186ce24713b6d5f1d2b5211acc";

const cryptoBaseUrl = "https://api.coinlayer.com/api/live";
const newsBaseUrl = "https://newsapi.org/v2/everything";

function formatQueryParams(params) {
	const queryItems = Object.keys(params).map(
		(key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
	);
	return queryItems.join("&");
}

function displayLivePrice(responseJson) {
	$("#current-price").empty();
	$("#js-crypto-error-message").text("");
	const cryptoName = Object.keys(responseJson.rates);
	const cryptoValue = Number(Object.values(responseJson.rates)).toFixed(2);
	$("#current-price").append(
		`<h2>1 ${cryptoName} is ${cryptoValue} ${responseJson.target}</h2>
        `
	);
	$("#news").removeClass("hidden");
}

function displayNews(responseJson) {
	console.log(responseJson);
	$("#js-news-error-message").text("");
	$("#news-section-title").empty();
	$("#news-list").empty();

	if (responseJson.articles.length < 10) {
		$("#news-section-title").text("Sadly, no news articles available. Please select a different cryptocurrency.");
	} else {
		$("#news-section-title").text("Latest News");
		for (let i = 0; i < responseJson.articles.length; i++) {
			$("#news-list").append(`
            <li><h3>${responseJson.articles[i].title}</h3>
            <p>Written By ${responseJson.articles[i].author}</p>
            <p>${responseJson.articles[i].source.name}</p>
            <a href="${responseJson.articles[i].url}" target="_blank">More Info</a>
            </li>
            `);
		}
	}
}

function getLivePrice(searchTerm, currency) {
	const cryptoParams = {
		access_key : cryptoKey,
		target     : currency,
		symbols    : searchTerm
	};
	const queryString = formatQueryParams(cryptoParams);
	const url = cryptoBaseUrl + "?" + queryString;
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
	const newsParams = {
		q        : newsSearchTerm,
		language : "en"
	};
	const queryString = formatQueryParams(newsParams);
	const url = newsBaseUrl + "?" + queryString;
	const options = {
		headers : new Headers({
			"X-Api-Key" : newsKey
		})
	};
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
		const searchTerm = $("#js-crypto").val();
		const newsSearchTerm = `${$("#js-crypto option:selected").text()} cryptocurrency`;
		console.log(newsSearchTerm);
		const selectedCurrency = $("#js-fiat").val();
		getLivePrice(searchTerm, selectedCurrency);
		getLatestNews(newsSearchTerm);
	});
}

$(watchForm);
