WebOrders.dbREST = {
    loadDataPar: function (url,par) {
        return new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                return $.getJSON(url, par);
            }
        });
    },
    loadData: function (url) {
        return new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                return $.getJSON(url);
            }
        });
    },
    sendPost: function (url, par) {
                return $.post(url, par);
        }
}
