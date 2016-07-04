(function () {
    this.jsonp = function (url, data, jsonpcallback, callback) {
        var cbName = 'cb' + counter++; //cb1 cb2 cb3
        var callbackName = 'window.jsonp.' + cbName;
        window.jsonp[cbName] = function (data) {
            try {
                callback(data);
            } finally {
                script.parentNode.removeChild(script);
                delete window.jsonp[cbName];
            }
        };
        var src = tools.padStringToURL(url, data);
        src = tools.padStringToURL(src, jsonpcallback + '=' + callbackName);
        var script = document.createElement('script');
        script.async = 'async';
        script.type = 'text/javascript';
        script.src = src;
        document.documentElement.appendChild(script);
    };
    var counter = 1;
    var tools = {
        padStringToURL: function (url, param) {
            param = this.encodeToURIString(param);
            if (!param) {
                return url;
            }
            return url + (/\?/.test(url) ? '&' : '?') + param;
        },
        encodeToURIString: function (data) {
            if (!data) {
                return '';
            }
            if (typeof data === 'string') {
                return data;
            }
            var arr = [];
            for (var n in data) {
                if (!data.hasOwnProperty(n)) continue;
                arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
            }
            return arr.join('&');
        }
    }
})();
