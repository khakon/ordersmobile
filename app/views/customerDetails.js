WebOrders = window.WebOrders || {};
WebOrders.customerDetails = function () {
    WebOrders.app.navigation[1].option('visible', false);
    WebOrders.app.navigation[5].option('visible', false);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', true);
    WebOrders.app.navigation[3].option('visible', true);
    WebOrders.app.navigation[4].option('visible', true);
    var currentCustomer = ko.observable(WebOrders.db.getCustomer());
    var order = WebOrders.db.getCurrentOrder();
    var comment = ko.observable('');
    if (order.comment) comment(order.comment);
    var payment = ko.observable(order.payment),
    number = ko.observable(order.number),
    save = ko.observable(order.save),
    now = order.date;
    var saveOrder = function (item) {
        order = WebOrders.db.getCurrentOrder();
        if (viewModel.comment().length > 0) order.comment = viewModel.comment();
        var total = 0;
        ko.utils.arrayForEach(order.wares, function (item) {
            var value = parseFloat(item.sum);
            if (!isNaN(value)) {
                total += value;
            }
        });
        if (total == 0) {
            DevExpress.ui.notify('В заказе не выбран товар', "info", 2000);
            return;
        }
        order.total = Math.round(total * 100) / 100;
        order.save = false;
        WebOrders.db.saveOrder(order);
        WebOrders.app.navigate("orders", { root: true });
    };
    var deleteOrder = function () {
        var cancel = function () {
            return "cancel";
        };
        var del = function () {
            return "Удаление";
        };
        var customDialog = DevExpress.ui.dialog.custom({
            title: "Удаление заказа",
            message: "Подтвердите удаление заказа для " + currentCustomer().Kontr,
            buttons: [
                { text: "Удалить", onClick: del },
                { text: "Отмена", onClick: cancel },
            ]
        });
        customDialog.show().done(function (dialogResult) {
            DevExpress.ui.notify(dialogResult, "info", 1000);
            if (dialogResult == 'cancel') return;
            if (WebOrders.db.deleteOrder(order.customer, order.number)) WebOrders.app.navigate("customers", { root: true });
            else DevExpress.ui.notify('Удаление невозможно. Заказ отправлен.', "info", 2000);
        });
    };
    var exitOrder = function () {
        WebOrders.app.navigate("orders", { root: true });
    };
    var viewModel = {
        dateFormat: {
            pickerType: 'calendar',
//            type: "date",
            value: now,
            onOpened: function () {
                var calendarInstance = $("#dateBox").dxDateBox("instance").content().find(".dx-calendar").dxCalendar("instance");
                calendarInstance.option("width", "260px");
                calendarInstance.option("height", "260px");
            },
            onValueChanged: function (data) {
                WebOrders.db.editOrder(currentCustomer(), 'date', data.value.replace('/', '-'));
            }
        },
        currentCustomer: currentCustomer,
        payment: payment,
        comment: comment,
        number:number,
        saveOrder: saveOrder,
        exitOrder: exitOrder,
        deleteOrder: deleteOrder,
        save:save
    }
    return viewModel;
    };