WebOrders.customers = function (params) {
    "use strict";
        WebOrders.app.navigation[1].option('visible', true);
        WebOrders.app.navigation[5].option('visible', true);
        WebOrders.app.navigation[0].option('visible', false);
        WebOrders.app.navigation[2].option('visible', false);
        WebOrders.app.navigation[3].option('visible', false);
        WebOrders.app.navigation[4].option('visible', false);
        var customersAll = ko.observableArray(WebOrders.db.getCustomers());
        var viewModel = {
            searchString: ko.observable(""),
            customersAll: customersAll,
            isLoadPrice: ko.observable(false),
            viewShowing: function () {

            }
        };
        viewModel.selectCustomer = function (item) {
            var cancel = function () {
                return "Отмена";
            };
            var order = function () {
                return "Новый";
            };
            var history = function () {
                return "История";
            };
            var customDialog = DevExpress.ui.dialog.custom({
                title: "Заказ",
                message: "Режим работы",
                buttons: [
                { text: "Новый", onClick: order },
                { text: "История", onClick: history },
                { text: "Отмена", onClick: cancel },
                ]
            });
            customDialog.show().done(function (dialogResult) {
                DevExpress.ui.notify(dialogResult, "info", 1000);
                if (dialogResult == 'Отмена') return;
                if (dialogResult == 'История') {
                WebOrders.app.navigate("history/" + item.model.idKontr, { root: true });
                return;
                }
                createOrder(item);
            });
        };
        var createOrder = function (item) {
            var payment;
            var now = new Date();
            var date = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)).format('YYYY-MM-DD')
            var cancel = function () {
                return "cancel";
            };
            var cash = function () {
                return "Наличный";
            };
            var bank = function () {
                return "Безналичный";
            };
            var check = function () {
                return "Чек";
            };
            var customDialog = DevExpress.ui.dialog.custom({
                title: "Виды расчета",
                message: "Выберите виды расчета",
                buttons: [
                    {
                        text: "Нал",
                        onClick: cash
                    },
                    {
                        text: "Б/нал",
                         onClick: bank
                    },
                    {
                        text: "Чек",
                        onClick: check
                    },
                    {
                        text: "Отм",
                        onClick: cancel
                    },
                ]
            });
            customDialog.show().done(function (dialogResult) {
                DevExpress.ui.notify(dialogResult, "info", 1000);
                if (dialogResult == 'cancel') return;
                payment = dialogResult;
                WebOrders.db.setGroup({});
                WebOrders.db.setCustomer(item.model);
                WebOrders.db.addOrder(item.model, payment, date);
                WebOrders.app.navigate("customerDetails", { root: true });
            });
            //console.log(item.model);
        }
        viewModel.loadPrices = function () {
            var cancel = function () {
                return "Отмена";
            };
            var prices = function () {
                return "Прайсы";
            };
            var orders = function () {
                return "История";
            };
            var customDialog = DevExpress.ui.dialog.custom({
                title: "Загрузка данных",
                message: "Начать загрузку",
                buttons: [
                    { text: "Прайсы", onClick: prices },
                    { text: "История", onClick: orders },
                    { text: "Отмена", onClick: cancel },
                ]
            });
            customDialog.show().done(function (dialogResult) {
                DevExpress.ui.notify(dialogResult, "info", 1000);
                if (dialogResult == 'Отмена') return;
                if (dialogResult == 'Прайсы') {
                    viewModel.isLoadPrice(true);
                    $.when(WebOrders.db.loadPrices(), WebOrders.db.loadGroups(), WebOrders.db.loadItems(), WebOrders.db.loadPlans())
                        .done(function () { viewModel.isLoadPrice(false); });
                    return;
                }
                if (dialogResult == 'История') {
                    viewModel.isLoadPrice(true);
                    $.when(WebOrders.db.loadHistory()).done(function () { viewModel.isLoadPrice(false); });
                    return;
                }
            });
        }
        //////Computed
        viewModel.customers = ko.computed(function () {
            var results = viewModel.customersAll();
            var filterLiter = viewModel.searchString();
            if (filterLiter.length > 1) {
                results = ko.utils.arrayFilter(results, function (item) {
                    return item.Kontr.toLowerCase().indexOf(filterLiter.toLowerCase()) > -1;
                });
            };
            return results;
        });
    return viewModel;
};