WebOrders.db = window.WebOrders.db || {};
var items_url = 'api/items';
(function () {
    var db = {
        loadItems: function () {
            var d = new $.Deferred();
            $.when(WebOrders.dbREST.loadData(items_url).load()).done(function (response) {
                ko.utils.arrayForEach(response, function (item) {
                    item.group = false;
                });
                var groupsString = JSON.stringify(response);
                localStorage.setItem('items', groupsString);
                d.resolve();
            });
            return d.promise();
        },
        getItems: function(par){
            var items;
            var d = new $.Deferred();
            var cachedItemsString = localStorage.getItem('items');
            if (!cachedItemsString) {
                db.loadItems().done(function (response) {
                    cachedItemsString = localStorage.getItem('items');
                    items = cachedItemsString ? JSON.parse(cachedItemsString) : [];
                    //items = ko.utils.arrayFilter(items, function (item) { return item.tree.indexOf(par.id) > -1; });
                    items = ko.utils.arrayFilter(items, function (item) { return item.ParentId == par.id; });
                    d.resolve(items.sort(function (l, r) { return l.Name.toLowerCase() > r.Name.toLowerCase() ? 1 : -1 }));
                });

            }
            else {
                var a = new Date();
                items = cachedItemsString ? JSON.parse(cachedItemsString) : [];
                var b = new Date();
                //console.log(b.getTime() - a.getTime());
                //items = ko.utils.arrayFilter(items, function (item) { return item.tree.indexOf(par.id) > -1; });
                items = ko.utils.arrayFilter(items, function (item) { return item.ParentId == par.id; });
                var c = new Date();
                //console.log(c.getTime() - b.getTime());
                d.resolve(items.sort(function (l, r) { return l.Name.toLowerCase() > r.Name.toLowerCase() ? 1 : -1 }));
            }
            return d.promise();
        },
        setItem: function (item) {
          var itemString = JSON.stringify(item);
          localStorage.setItem('item', itemString);
        },
        getItem: function () {
            var cachedItemString = localStorage.getItem('item');
            var item = cachedItemString ? JSON.parse(cachedItemString) : {};
            return item;
        },
    };
    $.extend(WebOrders.db, db);
})();
