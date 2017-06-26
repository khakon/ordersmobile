WebOrders.db = window.WebOrders.db || {};
var prices_url = 'api/prices';
(function () {
    var db = {
        loadPrices: function () {
            var d = new $.Deferred();
            $.when(WebOrders.dbREST.loadData(prices_url).load()).done(function (response) {
                var pricesString = JSON.stringify(response);
                localStorage.setItem('prices', pricesString);
                d.resolve();
            });
            return d.promise();
        },
        prices: function () {
            var cachedPricesString = localStorage.getItem('prices');
            //if (!cachedPricesString) {
            //    this.loadPrices();
            //    cachedPricesString = localStorage.getItem('prices');
            //}
            var prices = cachedPricesString ? JSON.parse(cachedPricesString) : [];
            return prices;
        },
        getPrice: function (product, customer) {
            if (this.prices().length == 0) {
                DevExpress.ui.notify('Прайс не загружен', "warning", 1000);
                return {
                    Price: 0,
                    Discount: 0
                }
            }
            var price = ko.utils.arrayFirst(this.prices(), function (item) {
                return item.TovId == product && item.KnId == customer;
            });
            //if (!price) {
            //    price = ko.utils.arrayFirst(this.prices(), function (item) {
            //        return item.TovId == product;
            //    });
            //}
            //if (!price) {
            //    DevExpress.ui.notify('Цены не найдены', "error", 1000);
            //    return {
            //        Price: 0,
            //        Discount: 0
            //    }
            //}
            return price;
        }
    };
    $.extend(WebOrders.db, db);
})();
