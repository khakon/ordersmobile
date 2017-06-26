WebOrders.orders = function (params) {
    "use strict";
    WebOrders.app.navigation[1].option('visible', true);
    WebOrders.app.navigation[5].option('visible', true);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', false);
    WebOrders.app.navigation[3].option('visible', false);
    WebOrders.app.navigation[4].option('visible', false);
    var ordersAll = ko.observable(WebOrders.db.orders()),
    showSelectTotals = ko.observable(false),
    isSaveOrders = ko.observable(false);
    var selectTotals = function () {
        showSelectTotals(true);
        $('.select-list').click(function () {
            $(this).toggleClass('select');
            console.log($(this));
        });
    };
    var viewModel = {
        ordersAll: ordersAll,
        isSaveOrders: isSaveOrders,
        showSelectTotals: showSelectTotals,
        selectTotals:selectTotals,
        searchString: ko.observable("")
    };

    viewModel.orders = ko.computed(function () {
        var results = [];
        ko.utils.arrayForEach(viewModel.ordersAll(), function (item) {
                for (var i in item) {
                    results.push(item[i]);
                }
        });
        if (results) {
            ko.utils.arrayForEach(results, function (item) {
                if (!item.total) item.total = 0;
                item.dateStr = Globalize.format(new Date(item.date.substring(0, 10)), 'dd/MM/yy');
                item.total = Math.round(item.total * 100) / 100;
            });
        }
        var filterLiter = viewModel.searchString();
        if (filterLiter.length > 1) {
            results = ko.utils.arrayFilter(results, function (item) {
                return item.customer.Kontr.toLowerCase().indexOf(filterLiter.toLowerCase()) > -1 || item.dateStr.indexOf(filterLiter) > -1;
            });
        };
        return results;
    });
    viewModel.deleteOrder = function (item) {
        var cancel = function () {
            return "cancel";
        };
        var del = function () {
            return "Удаление";
        };
        var customDialog = DevExpress.ui.dialog.custom({
            title: "Удаление заказа",
            message: "Подтвердите удаление заказа для " + item.model.customer.Kontr,
            buttons: [
                { text: "Удалить", onClick: del },
                { text: "Отмена", onClick: cancel },
            ]
        });
        customDialog.show().done(function (dialogResult) {
            DevExpress.ui.notify(dialogResult, "info", 1000);
            if (dialogResult == 'cancel') return;
            if (WebOrders.db.deleteOrder(item.model.customer,item.model.number)) viewModel.ordersAll(WebOrders.db.orders());
            else DevExpress.ui.notify('Удаление невозможно. Заказ отправлен.', "info", 2000);
        });
    };
    viewModel.selectOrder = function (item) {
        WebOrders.db.setCustomer(item.model.customer);
        WebOrders.db.setCurrentOrder(item.model);
        WebOrders.db.setGroup({});
        WebOrders.app.navigate("customerDetails", { root: true });
    };
    viewModel.totals = function () {
        WebOrders.app.navigate("totals/0", { root: true });
    };
    viewModel.filterDate = function (item) { viewModel.searchString(item.model.dateStr); }
    viewModel.saveAll = function () {
        isSaveOrders(true);
        WebOrders.db.sendOrders().done(function (response) {
            //console.log(response);
            DevExpress.ui.notify(response, "info", 2000);
            ordersAll(WebOrders.db.orders());
            isSaveOrders(false);
        });
    }
    return viewModel;
};