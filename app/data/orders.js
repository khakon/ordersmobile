WebOrders.db = window.WebOrders.db || {};
var orders_url = 'orders/save/';
var Order = function (customer, payment, date) {
    return {
        date: date,
        save: false,
        payment: payment,
        customer: customer,
        comment:'',
        wares: []
    };
};
var checkProperty = function (obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}
var SendOrder = function (order, result) {
    ko.utils.arrayForEach(order.wares, function (ware) {
        result.push({
            date: order.date,
            number: order.number,
            payment: order.payment,
            agent: order.customer.idAgent,
            customer: order.customer.idKontr,
            ItemId: ware.ItemId,
            quantity: ware.quantity,
            price: ware.price,
            sum: ware.sum,
            comment: order.comment,
            timeStamp: order.timeStamp//Globalize.format(new Date(item.date.substring(0, 10)), 'dd/MM/yy').replace('/', '-')
        });
    })
    return result;
};
(function () {
    var db = {
        resetNumber: function(){
            localStorage.setItem('number', JSON.stringify(0));
        },
        getNumber: function () {
            var cachedNumber = localStorage.getItem('number');
            var number = cachedNumber ? JSON.parse(cachedNumber) : 0;
            number++;
            db.setNumber(number);
            return number;
        },
        setNumber: function (number) {
            localStorage.setItem('number', JSON.stringify(number));
        },
        orders: function () {
            var cachedOrdersString = localStorage.getItem('orders');
            var orders = cachedOrdersString ? JSON.parse(cachedOrdersString) : {};
            var list = [];
            for(key in orders){
                list.push(orders[key]);
            }
            return list;
        },
        getWaresOrders: function(){
            var orders = WebOrders.db.orders();
            var wares = [];
            ko.utils.arrayForEach(orders, function (item) {
                for (p in item) {
                    ko.utils.arrayForEach(item[p].wares, function (it) {
                        var ware = ko.utils.arrayFirst(wares, function (w) {
                            return w.ItemId == it.ItemId;
                        })
                        if (ware) {
                            ware.sum += it.sum;
                            ware.quantity += it.quantity;
                        }
                        else wares.push(it);
                    });
                }
            });

            return wares;
        },
        getOrders: function () {
            var cachedOrdersString = localStorage.getItem('orders');
            var orders = cachedOrdersString ? JSON.parse(cachedOrdersString) : {};
            return orders;
        },
        getCurrentOrder: function () {
            var cachedOrderString = localStorage.getItem('order');
            var order = cachedOrderString ? JSON.parse(cachedOrderString) : {};
            return order;
        },
        setCurrentOrder: function (order) {
            localStorage.setItem('order', JSON.stringify(order));
        },
        addOrder: function (customer,payment,date) {
            var orders = this.getOrders();
            orders[customer.idKontr] = orders[customer.idKontr] || {};
            var order = new Order(customer, payment, date);
            order.number = db.getNumber();
            db.setCurrentOrder(order);
            orders[customer.idKontr][order.number] = order;
            localStorage.setItem('orders', JSON.stringify(orders));
        },
        editOrder: function (customer, number, key, value) {
            var orders = this.getOrders();
            var order = orders[customer.idKontr][number];
            order[key] = value;
            localStorage.setItem('orders', JSON.stringify(orders));
        },
        getOrder: function (customer, number) {
            var orders = this.getOrders();
            return orders[customer.idKontr][number];
        },
        saveOrder: function (order) {
            var orders = db.getOrders();
            var total = 0;
            ko.utils.arrayForEach(order.wares, function (item) {
                var value = parseFloat(item.sum);
                if (!isNaN(value)) {
                    total += value;
                }
            });
            order.total = total;
            order.timeStamp = new Date();
            db.setCurrentOrder(order);
            orders[order.customer.idKontr][order.number] = order;
            localStorage.setItem('orders', JSON.stringify(orders));
        },
        deleteOrder: function (customer, number) {
            var orders = this.getOrders();
            if (orders[customer.idKontr][number].save) return false;
            delete orders[customer.idKontr][number];
            if (!checkProperty(orders[customer.idKontr])) delete orders[customer.idKontr];
            localStorage.setItem('orders', JSON.stringify(orders));
            return true;
        },
        sendOrders: function () {
            var d = new $.Deferred();
            var orders = db.orders();
            var result = [];
            ko.utils.arrayForEach(orders, function (item) {
                for (p in item) {
                    if (!item[p].save) SendOrder(item[p], result);
                }
            });
            if (result.length == 0) return d.resolve('Нет данных для записи');
            $.when(WebOrders.dbREST.sendPost(orders_url, { model: ko.toJSON(result) })).done(function (response) {
                if (response == 'Записано') {
                    var list = db.getOrders();
                    for (var p in list) {
                        for (var i in list[p]) {
                            if (!list[p][i].save) list[p][i].save = true;
                        }
                    }
                    localStorage.removeItem('orders');
                    localStorage.setItem('orders', JSON.stringify(list));
                    d.resolve(response);
                }
            });
            return d.promise();
        },
        getAllWares: function () {
            var d = new $.Deferred();
            var orders = db.orders();
            var result = [];
            ko.utils.arrayForEach(orders, function (item) {
                for (p in item) {
                    ko.utils.arrayForEach(item[p].wares, function (ware) {
                        result.push({
                            date: order.date,
                            number: order.number,
                            payment: order.payment,
                            agent: order.customer.idAgent,
                            customer: order.customer.idKontr,
                            ItemId: ware.ItemId,
                            quantity: ware.quantity,
                            price: ware.price,
                            sum: ware.sum,
                            comment: order.comment,
                            timeStamp: order.timeStamp//Globalize.format(new Date(item.date.substring(0, 10)), 'dd/MM/yy').replace('/', '-')
                        });
                    })
                }
            });
            return result;
        },
        clear: function () {
            localStorage.removeItem('orders');
        }

    };
    $.extend(WebOrders.db, db);
})();