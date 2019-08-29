"use strict";

const cryptoKey = "9c4387f84eba763603c845c574f84888";
const cryptoBaseUrl = "http://api.coinlayer.com/api/live";

function formatQueryParams(params) {
	const queryItems = Object.keys(params).map(
		(key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
	);
	return queryItems.join("&");
}

function displayLivePrice(responseJson) {
	const cryptoName = Object.keys(responseJson.rates);
	const cryptoValue = Number(Object.values(responseJson.rates)).toFixed(2);
	$("#current-price").append(
		`<h2>1 ${cryptoName} is ${cryptoValue} ${responseJson.target}</h2>
        `
	);
	$("#results").removeClass("hidden");
}

function getLivePrice(searchTerm, currency) {
	const params = {
		access_key : cryptoKey,
		target     : currency,
		symbols    : searchTerm
	};
	const queryString = formatQueryParams(params);
	const url = cryptoBaseUrl + "?" + queryString;

	console.log(url);

	fetch(url).then((response) => response.json()).then((responseJson) => displayLivePrice(responseJson));
}

function watchForm() {
	$("form").submit((event) => {
		event.preventDefault();
		const searchTerm = $("#js-search-term").val();
		const selectedCurrency = $("#js-fiat").val();
		getLivePrice(searchTerm, selectedCurrency);
	});
}

$(watchForm);
