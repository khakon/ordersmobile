WebOrders.db = window.WebOrders.db || {};
var agents_url = 'api/account';
(function () {
    var db = {};
  
    var db = {
        loadAgents: function (success, fail) {
            WebOrders.dbREST.loadData(agents_url).load()
            .done(function (result) {
                success.call(this, result);
            })
            .fail(fail);
        },
        logOn: function (par, success, fail) {
            WebOrders.dbREST.loadDataPar(agents_url, par).load()
            .done(function (result) {
                success.call(this, result);
            })
            .fail(fail);
        },
        agent: function () {
            var cachedAgentString = localStorage.getItem('agent');
            var agent = cachedAgentString ? JSON.parse(cachedAgentString) : '';
            return agent;
        },
        selectAgent: function (result) {
            localStorage.removeItem('agent');
            localStorage.setItem('agent', JSON.stringify(result));
        },
        setAuth: function () {
            localStorage.setItem('auth',Globalize.format(new Date(), 'dd/MM/yy'))
        },
        getAuth: function () {
            var auth = '';
            try{
                auth = localStorage.getItem('auth');
            }
            catch(err){}
            return auth == Globalize.format(new Date(), 'dd/MM/yy');
        }
    }
    $.extend(WebOrders.db, db);
})();