WebOrders.db = window.WebOrders.db || {};
var history_url = 'api/history';
(function () {
    var db = {
        loadHistory: function () {
            var d = new $.Deferred();
            $.when(WebOrders.dbREST.loadData(history_url).load())
          .done(function (result) {
              localStorage.setItem('history', JSON.stringify(result));
              return d.resolve();
          });
            return d.promise();
        },
        history: function (code) {
            var cachedString = localStorage.getItem('history');
            var history = cachedString ? JSON.parse(cachedString) : {};
            var result = [];
            var docs = [];
            history = ko.utils.arrayFilter(history, function (item) {
                return item.code == code;
            });
            ko.utils.arrayForEach(history, function (item) {
                if (docs.indexOf(item.iddoc) > -1) return;
                docs.push(item.iddoc);
            });
            ko.utils.arrayForEach(docs, function (d) {
                var doc = ko.utils.arrayFirst(history, function (h) {
                    return h.iddoc == d;
                });
                var total = 0;
                ko.utils.arrayForEach(history, function (s) {
                    if (s.iddoc == d) total += s.suma;
                });
                doc.suma = total;
                result.push(doc);
            });
            return result;
        },
        historyItem: function (id) {
            var cachedString = localStorage.getItem('history');
            var history = cachedString ? JSON.parse(cachedString) : {};
            return ko.utils.arrayFilter(history, function (item) {
                return item.iddoc == id;
            });
        }
    };
    $.extend(WebOrders.db, db);
})();