WebOrders = window.WebOrders || {};
WebOrders.historyItems = function (params) {
    WebOrders.app.navigation[1].option('visible', true);
    WebOrders.app.navigation[5].option('visible', true);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', false);
    WebOrders.app.navigation[3].option('visible', false);
    WebOrders.app.navigation[4].option('visible', false);
    var orderItems = ko.observableArray([]);
    var viewModel = {
        viewShowing: function () {
            var result = WebOrders.db.historyItem(params.id);
            orderItems(result.sort(function (l, r) { return l.tov.toLowerCase() > r.tov.toLowerCase() ? 1 : -1 }));
        },
        orderItems: orderItems
    };
    viewModel.total = ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(viewModel.orderItems(), function (item) {
            var value = parseFloat(item.suma);
            if (!isNaN(value)) {
                total += value;
            }
        });
        return Math.round(total * 100) / 100;
    });
    return viewModel;
};