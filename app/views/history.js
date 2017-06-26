WebOrders.history = function (params) {
    "use strict";
    WebOrders.app.navigation[1].option('visible', true);
    WebOrders.app.navigation[5].option('visible', true);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', false);
    WebOrders.app.navigation[3].option('visible', false);
    WebOrders.app.navigation[4].option('visible', false);
    var ordersAll = ko.observable(WebOrders.db.history(params.id));
    var viewModel = {
    };
    viewModel.kontr = ko.computed(function () {
        if (ordersAll().length > 0) return ordersAll()[0].kontr;
        return 'Нет заказов';
    });
    viewModel.orders = ko.computed(function () {
        var results = ordersAll();
            ko.utils.arrayForEach(results, function (item) {
                item.dateStr = Globalize.format(new Date(item.period.substring(0, 10)), 'dd/MM/yy');
                item.suma = Math.round(item.suma * 100) / 100;
            });
        return results;
    });
    viewModel.select = function (item) {
        WebOrders.app.navigate('historyItems/' + item.model.iddoc);
    };
    return viewModel;
};