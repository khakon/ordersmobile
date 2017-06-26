WebOrders = window.WebOrders || {};
WebOrders.OrderItems = function (params) {
    WebOrders.app.navigation[1].option('visible', false);
    WebOrders.app.navigation[5].option('visible', false);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', true);
    WebOrders.app.navigation[3].option('visible', true);
    WebOrders.app.navigation[4].option('visible', true);
    var currentCustomer = WebOrders.db.getCustomer();
    var orderItems = ko.observableArray([]);
    var order = WebOrders.db.getCurrentOrder();
    var deleteItem = function (item) {
        var cancel = function () {
            return "cancel";
        };
        var del = function () {
            return "Удаление";
        };
        var customDialog = DevExpress.ui.dialog.custom({
            title: "Удаление товара",
            message: "Подтвердите удаление для " + item.model.Name,
            buttons: [
                { text: "Удалить", onClick: del },
                { text: "Отмена", onClick: cancel },
            ]
        });
        customDialog.show().done(function (dialogResult) {
            DevExpress.ui.notify(dialogResult, "info", 1000);
            if (dialogResult == 'cancel') return;
            order = WebOrders.db.getCurrentOrder();
            //console.log(viewModel.orderItems().indexOf(item.model));
            var index = viewModel.orderItems().indexOf(item.model);
            order.wares.splice(index, 1);
            viewModel.orderItems(order.wares);
            WebOrders.db.saveOrder(order);
        });
    };
    var viewModel = {
        viewShowing: function () {
            if(order && order.wares) orderItems(order.wares);
        },
        orderItems: orderItems,
        deleteItem: deleteItem
    };
    viewModel.total = ko.computed(function () {
        var total = 0;
        ko.utils.arrayForEach(viewModel.orderItems(), function (item) {
            var value = parseFloat(item.sum);
            if (!isNaN(value)) {
                total += value;
            }
        });
        return Math.round(total * 100) / 100;
    });
    viewModel.setCurrent = function (item) {
        WebOrders.db.setItem(item.model);
        WebOrders.indexEdit = viewModel.orderItems().indexOf(item.model);
        //console.log(item.model);
        WebOrders.app.navigate("itemEdit", { root: true });
    }
    return viewModel;
};