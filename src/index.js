export default function operator() {
    const operator = {};
    const timing = {
        get vals() {
            if (
                window.performance &&
                window.performance.getEntriesByType("navigation")
            ) {
                return window.performance.getEntriesByType("navigation")[0];
            } else if (window.performance && window.performance.timing) {
                return window.performance.timing;
            } else {
                return undefined;
            }
        }
    };

    /**
     * Page Load in ms
     * Returns a promise that when completed will send the page load time
     * Created by subtracting the navigation start from the end of the load events.
     */
    operator.pageLoad = waitForValue("fetchStart", "loadEventEnd");

    /**
     * Resource Load Time in ms
     * Returns a promise that when completed will send the resource load time.
     * Created by subtracting the navigation start from the response end.
     */
    operator.resourcesLoaded = waitForValue("fetchStart", "responseEnd");

    /**
     * This function will try every 100ms to collect the value of the resource.
     * @return {Promise} A Promise that is awaiting a value.
     */
    function waitForValue(firstEvent, endingEvent) {
        var fullLoad = timing.vals[endingEvent] - timing.vals[firstEvent];
        var promise = new Promise(function cb(resolve, reject) {
            if (fullLoad < 0) {
                window.setTimeout(function() {
                    fullLoad =
                        timing.vals[endingEvent] - timing.vals[firstEvent];
                    cb(resolve, reject);
                }, 100);
            } else {
                resolve(fullLoad);
            }
        });
        return promise;
    }

    return operator;
}
