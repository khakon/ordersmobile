WebOrders = window.WebOrders || {};
WebOrders.totals = function (params) {
    WebOrders.app.navigation[1].option('visible', true);
    WebOrders.app.navigation[5].option('visible', true);
    WebOrders.app.navigation[0].option('visible', false);
    WebOrders.app.navigation[2].option('visible', false);
    WebOrders.app.navigation[3].option('visible', false);
    WebOrders.app.navigation[4].option('visible', false);
    var groupsAll = ko.observableArray();
    var id = ko.observable(params.id);
    var wares = ko.observableArray([]);
    var loadGroups = function () {
        WebOrders.db.getGroups({ id: params.id }).done(function (response) {
            groupsAll(response);
        });
    }
    var totalWares = function () {
        wares(WebOrders.db.getWaresOrders());
    };
    //////Computed
    var groups = ko.computed(function () {
        var results = [];
        ko.utils.arrayForEach(groupsAll(), function (item) {
            if (wares().length == 0) return;
            var waresGroup = ko.utils.arrayFilter(wares(), function (it) {
                return it.tree.indexOf(item.GroupId) > -1;
            });
            if (waresGroup.length == 0) return;
            item.sum = 0;
            ko.utils.arrayForEach(waresGroup, function (it) {
                item.sum += it.sum;
            });
            item.navigate = true;
            results.push(item);
        });
        ko.utils.arrayForEach(wares(), function (item) {
            if (item.ParentId != id()) return;
            item.navigate = false;
            results.push(item);
        });
        return results;
    });
    var totalOrders = ko.computed(function () {
        var orders = WebOrders.db.orders();
        var total = 0;
        ko.utils.arrayForEach(orders, function (item) {
            for (p in item) {
                    var value = parseFloat(item[p].total);
                    if (!isNaN(value)) {
                        total += value;
                    }
            }
        });
        total = Math.round(total * 100) / 100;
        return total;
    });
    var checkRoot = function () { return id() != "0" }
    /////////////////////handlers
    var setCurrent = function (item) {
        if (!item.model.navigate) return;
        WebOrders.app.navigate("totals/" + item.model.GroupId, { root: true });
        return;
    }
    var parent = function () {
        var group = WebOrders.db.findGroup(id());
        if (!group.GroupId) {
            WebOrders.app.navigate("totals/0", { root: true });
            return;
        }
        WebOrders.app.navigate("totals/" + group.ParentId, { root: true });
    }
    var root = function () {
        WebOrders.app.navigate("totals/0", { root: true });
    }
    var viewModel = {
        totalOrders: totalOrders,
        groups: groups,
        setCurrent: setCurrent,
        checkRoot: checkRoot,
        parent: parent,
        root: root,
        groupsAll: groupsAll,
        wares: wares,
        viewShowing: function () {
            totalWares();
            loadGroups();
        }
    }
    return viewModel;
    };