WebOrders.groups = function (params) {
    "use strict";
    WebOrders.app.navigation[1].option('visible', false);
    WebOrders.app.navigation[5].option('visible', false);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', true);
    WebOrders.app.navigation[3].option('visible', true);
    WebOrders.app.navigation[4].option('visible', true);
    var groupsAll = ko.observableArray();
    var itemsAll = ko.observableArray();
    var id = ko.observable(params.id);
    var visibleRoot = ko.observable();
    var visiblePopup = ko.observable(false);
    var currentCustomer = WebOrders.db.getCustomer();
    var currentItem = ko.observable(WebOrders.db.getItem());
    var priceRef = ko.observable('');
    var price = ko.observable(''); 
    var priceDisc = ko.observable('');
    var quantity = ko.observable('');
    var loadGroups = function (id) {
        WebOrders.db.getGroups({ id: id }).done(function (response) {
            visibleRoot(WebOrders.db.getGroup() != "0");
            groupsAll(response);
            loadItems(id);
        })
    }
    var loadItems = function (id) {
        WebOrders.db.getItems({ id: id }).done(function (response) {
            itemsAll(response);
        })
    }
    var save = function (item, pack) {
        if (!viewModel.quantity() > 0) return;
        var item = item.model;
        item.quantity = viewModel.quantity();
        if (pack) item.quantity = viewModel.quantity() * item.Volume;
        item.price = priceDisc() || price() || priceRef();
        item.sum = Math.round(item.price * item.quantity * 100) / 100;
        addItem(item);
        quantity('');
    };
    var addItem = function (item) {
        var order = WebOrders.db.getCurrentOrder();
        order.wares.push(item);
        WebOrders.db.saveOrder(order);
        visiblePopup(false);
        //DevExpress.ui.notify(item.Name + ' добавлен', "info", 1000);
    }
    var viewModel = {
        searchString: ko.observable(""),
        groupsAll: groupsAll,
        itemsAll: itemsAll,
        id: id,
        visibleRoot: visibleRoot,
        currentItem: currentItem,
        priceRef: priceRef,
        price: price,
        priceDisc: priceDisc,
        quantity: quantity,
        save: save,
        visiblePopup:visiblePopup,
        popupOptions: {
                //width: 1100,
                //height: 800,
                contentTemplate: "product",
                showTitle: true,
                //title: currentItem().Name,
                visible: visiblePopup,
                dragEnabled: false,
                closeOnOutsideClick: true,
                resizeEnabled: true
                                   },
        viewShowing: function () {
            loadGroups(params.id);
        }
    };
    var paramNavigate;
    viewModel.setCurrent = function (item) {
        if (item.model.group) {
            WebOrders.db.setGroup(item.model.GroupId);
            loadGroups(item.model.GroupId);
            return;
        }
        WebOrders.db.setItem(item.model);
        currentItem(item.model);
        var prices = WebOrders.db.getPrice(currentItem().ItemId, currentCustomer.idKontr);
        priceRef(currentItem().priceRef);
        if (prices) {
            price(prices.Price);
            priceDisc(prices.Discount);
        }
        visiblePopup(true);
    }
    viewModel.parent = function () {
        var group = WebOrders.db.getGroup();
        if (!group) {
             WebOrders.db.setGroup("0");
            loadGroups("0");
            return;
        }
        group = WebOrders.db.findGroup(group);
        if (!group) {
             WebOrders.db.setGroup("0");
            loadGroups("0");
            return;
        }
        WebOrders.db.setGroup(group.ParentId);
        loadGroups(group.ParentId);
    }
    viewModel.root = function (item) {
        WebOrders.db.setGroup("0");
        loadGroups("0");
    }
    //////Computed
    viewModel.items = ko.computed(function () {
        var results = [];
        var filterLiter = viewModel.searchString();
        var a = new Date();
        ko.utils.arrayForEach(viewModel.groupsAll(), function (item) {
            if (filterLiter.length > 1 && item.Name.toLowerCase().indexOf(filterLiter.toLowerCase()) <0) return;
            results.push(item);
        });
        ko.utils.arrayForEach(viewModel.itemsAll(), function (item) {
            if (filterLiter.length > 1 && item.Name.toLowerCase().indexOf(filterLiter.toLowerCase()) < 0) return;
            results.push(item);
        });
        var b = new Date();
        console.log(b.getTime() - a.getTime());
        return results;
    });
    return viewModel;
};