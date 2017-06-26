WebOrders.db = window.WebOrders.db || {};
var plan_url = 'api/plans';
(function () {
    var db = {
        loadPlans: function () {
            var d = new $.Deferred();
            $.when(WebOrders.dbREST.loadData(plan_url).load()).done(function (response) {
                var plansString = JSON.stringify(response);
                localStorage.setItem('plans', plansString);
                d.resolve();
            });
            return d.promise();
        },
        plans: function () {
            var cachedPlansString = localStorage.getItem('plans');
            var plans = cachedPlansString ? JSON.parse(cachedPlansString) : [];
            return plans;
        }
    };
    $.extend(WebOrders.db, db);
})();
