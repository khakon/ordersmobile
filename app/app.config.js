// NOTE object below must be a valid JSON
window.WebOrders = $.extend(true, window.WebOrders, {
  "config": {
    "layoutSet": "navbar",
    "navigation": [
        {
        "title": "Вход",
        "onExecute": "#logOn",
        "icon": "home"
        },
        {
            "id": "customers",
            "title": "Клиенты",
            "onExecute":"#customers",
            "icon": "group",
            "visible":false
        },
        {
            "id": "groups",
            "title": "Товар",
            "onExecute": function () {
                var group = WebOrders.db.getGroup();
                if (!group) {
                    WebOrders.app.navigate("groups/0", { root: true });
                    return;
                }
                WebOrders.app.navigate("groups/" + group, { root: true });
            },
            "icon": "folder",
            "visible": false
        },
        {
            "id": "OrderItems",
            "title": "Заказ",
            "onExecute": "#OrderItems",
            "icon": "cart",
            "visible": false
        },
        {
            "id": "info",
            "title": "Инфо",
            "onExecute": "#customerDetails",
            "icon": "user",
            "visible": false
        },
        {
            "id": "orders",
            "title": "Заказы",
            "onExecute": "#orders",
            "icon": "menu",
            "visible": false
        }
    ]
  }
});