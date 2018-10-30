export default function operator() {
	const operator = {};
	const timing = performance.getEntriesByType("navigation")[0];

	///////
	// Page Load in ms
	// Returns a promise that when completed will send the page load time
	//
	// Created by subtracting the navigation start from the end of the
	// load events
	//////
	operator.pageLoad = () => {
		var fullLoad = timing.loadEventEnd - timing.fetchStart;
		var promise = new Promise(function cb(resolve, reject) {
			if (fullLoad < 0){
     				window.setTimeout(function() {
					fullLoad = timing.loadEventEnd - timing.fetchStart;
					cb(resolve, reject);
     				}, 100);
			} else {
				resolve(fullLoad);
			}
   		});
   		return promise;
	}

	window.op = operator;

	return operator;
}
