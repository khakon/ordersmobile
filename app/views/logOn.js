WebOrders.logOn = function (params) {
    "use strict";
    var agents = ko.observableArray([]);
    var viewModel = {
        agents: agents,
        agentId: ko.observable(''),
        passwordForId: ko.observable(''),
        viewShowing: function () {
            if (WebOrders.db.getAuth()) WebOrders.app.navigate("customers", { root: true });
            WebOrders.db.loadAgents(function (result) {
                agents(result);
            });
        }
    };
    viewModel.goPage = function (e) {
        var logOn = $.Deferred();
        WebOrders.db.logOn({ password: viewModel.passwordForId() }, function (result) { return logOn.resolve(result); });
        $.when(logOn).done(function (data) {  
            if (data === true) {
                init(e);
            }
        });
    };
    var init = function (e) {
        WebOrders.db.setAuth();
        WebOrders.agentId = e.model.agentId();
        WebOrders.db.selectAgent(e.model.agentId());
        var cust = $.Deferred();
        WebOrders.db.loadCustomers({ agentId: e.model.agentId() }, function (result) {
             cust.resolve(result);
        });
        $.when(cust).done(function (customers) {
            WebOrders.db.setCustomers(JSON.stringify(customers));
            WebOrders.app.navigate("customers", { root: true });
        });
    }
    return viewModel;
};

