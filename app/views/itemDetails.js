﻿WebOrders = window.WebOrders || {};
WebOrders.itemDetails = function () {
    WebOrders.app.navigation[1].option('visible', false);
    WebOrders.app.navigation[5].option('visible', false);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', true);
    WebOrders.app.navigation[3].option('visible', true);
    WebOrders.app.navigation[4].option('visible', true);
    var currentCustomer = WebOrders.db.getCustomer();
    var currentItem = ko.observable(WebOrders.db.getItem());
    var prices = WebOrders.db.getPrice(currentItem().ItemId, currentCustomer.idKontr);
    var priceRef = currentItem().priceRef;
    var price = prices.Price;
    var priceDisc = prices.Discount;
    var quantity = ko.observable('');
    var save = function (item, pack) {
        if (!viewModel.quantity() > 0) return;
        var item = item.model;
        item.quantity = viewModel.quantity();
        if (pack) item.quantity = viewModel.quantity() * item.Volume;
        item.price = price || priceDisc || priceRef;
        item.sum = Math.round(item.price * item.quantity * 100) / 100;
        addItem(item);
    };
    var viewModel = {
        currentItem: currentItem,
        priceRef: priceRef,
        price: price,
        priceDisc: priceDisc,
        quantity: quantity,
        save: save
    }
    var addItem = function (item) {
        //console.log(item);
        var order = WebOrders.db.getCurrentOrder();
        order.wares.push(item);
        WebOrders.db.saveOrder(order);
        DevExpress.ui.notify(item.Name + ' добавлен', "info", 1000);
        var group = WebOrders.db.getGroup();
        if (!group) {
            WebOrders.app.navigate("groups/0", { root: true });
            return;
        }
        WebOrders.app.navigate("groups/" + group, { root: true });
    }
    return viewModel;
    };