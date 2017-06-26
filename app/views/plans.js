WebOrders.plans = function (params) {
    "use strict";
    WebOrders.app.navigation[1].option('visible', true);
    WebOrders.app.navigation[5].option('visible', true);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', false);
    WebOrders.app.navigation[3].option('visible', false);
    WebOrders.app.navigation[4].option('visible', false);
    var viewModel = {totalPay:0};
    viewModel.plans = ko.computed(function () {
        var results = [];
        var wares = WebOrders.db.getWaresOrders();
        var groups = WebOrders.db.groups();
        var plans = WebOrders.db.plans();
        ko.utils.arrayForEach(plans, function (item) {
            item.completed = false;
            if (item.planSale == 0 && item.planQuant == 0) return;
            if (item.planSale > 0) {
                item.plan = item.planSale;
                item.fact = item.sale;
            }
            else {
                item.plan = item.planQuant;
                item.fact = item.quant;
            }
            item.name = ko.utils.arrayFirst(groups, function (gr) {
                return gr.GroupId == item.ware;
            }).Name;
            if (wares.length != 0) {
                var waresGroup = ko.utils.arrayFilter(wares, function (it) {
                    return it.tree.indexOf(item.ware) > -1;
                });
                ko.utils.arrayForEach(waresGroup, function (it) {
                    if (item.planSale > 0) item.fact += it.sum;
                    else item.fact += it.quantity;
                });
            }
            if (item.fact > item.plan) item.completed = true;
            item.percent = Math.round(item.fact / item.plan * 100);
            item.fact = Math.round(item.fact);
            item.pay = 0;
            if (item.percent >= item.percExec && item.percent < 100) item.pay = Math.round(item.rate * item.percent / 100);
            if (item.percent >= 100) {
                item.pay = item.rate;
                item.completed = true;
            }
            viewModel.totalPay += item.pay;
            results.push(item);
        });
        return results.sort(function (l, r) { return r.name < l.name; });
    });
    return viewModel;
};