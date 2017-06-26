WebOrders.db = window.WebOrders.db || {};
var customers_url = 'api/customers';
(function () {
    var db = {
      loadCustomers: function (par,success, fail) {
          WebOrders.dbREST.loadDataPar(customers_url, par).load()
        .done(function (result) {
            success.call(this, result);
        })
        .fail(fail);
      },
      setCustomers: function(customers){
          localStorage.removeItem('customers');
          localStorage.setItem('customers', customers);
      },
      getCustomers: function () {
            var cachedCustomersString = localStorage.getItem('customers');
            var customers = cachedCustomersString ? JSON.parse(cachedCustomersString) : [];
            return customers;
      },
      setCustomer: function (customer) {
          var customerString = JSON.stringify(customer);
          localStorage.setItem('customer', customerString);
      },
      getCustomer: function () {
          var cachedCustomerString = localStorage.getItem('customer');
          var customer = cachedCustomerString ? JSON.parse(cachedCustomerString) : {};
          return customer;
      },
    customerLocal: function (id) {
        var customer = ko.utils.arrayFirst(this.customers(), function (item) {
            return item.id == id;
        });
        return customer;
    },
    balance: function (par,success, fail) {
        $.when(WebOrders.loadDataPar(customers_url, par).load())
    .done(function (result) {
        success.call(this, result);
    })
    .fail(fail);
    },
};
    $.extend(WebOrders.db, db);
})();