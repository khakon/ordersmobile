WebOrders.db = window.WebOrders.db || {};
var groups_url = 'api/groups';
(function () {
    var db = {
        loadGroups: function () {
            var d = new $.Deferred();
            $.when(WebOrders.dbREST.loadData(groups_url).load()).done(function (response) {
                ko.utils.arrayForEach(response, function (item) {
                    item.group = true;
                });
                var groupsString = JSON.stringify(response);
                localStorage.setItem('groups', groupsString);
                d.resolve();
            });
            return d.promise();
        },
        getGroups: function (par) {
            var groups;
            var d = new $.Deferred();
            var cachedGroupsString = localStorage.getItem('groups');
            if (!cachedGroupsString) {
                db.loadGroups().done(function (response) {
                    cachedGroupsString = localStorage.getItem('groups');
                    groups = cachedGroupsString ? JSON.parse(cachedGroupsString) : [];
                    groups = ko.utils.arrayFilter(groups, function (item) { return item.ParentId == par.id })
                    d.resolve(groups.sort(function (l, r) { return l.Name.toLowerCase() > r.Name.toLowerCase() ? 1 : -1 }));
                });

            }
            else {
                groups = cachedGroupsString ? JSON.parse(cachedGroupsString) : [];
                groups = ko.utils.arrayFilter(groups, function (item) { return item.ParentId == par.id })
                d.resolve(groups.sort(function (l, r) { return l.Name.toLowerCase() > r.Name.toLowerCase() ? 1 : -1 }));
            }
            return d.promise();
        },
        setGroup: function (group) {
            var groupString = JSON.stringify(group);
            localStorage.setItem('group', groupString);
        },
        getGroup: function () {
            var cachedGroupString = localStorage.getItem('group');
            var group = "0";
            if(cachedGroupString && cachedGroupString != "{}") group = JSON.parse(cachedGroupString);
            return group;
        },
        groups: function () {
            var cachedGroupsString = localStorage.getItem('groups');
            if (!cachedGroupsString) {
                this.loadGroups();
                cachedGroupsString = localStorage.getItem('groups');
            }
            var groups = cachedGroupsString ? JSON.parse(cachedGroupsString) : [];
            return groups;
        },
        findGroup: function (id) {
            var group = ko.utils.arrayFirst(this.groups(), function (item) {
                return item.GroupId == id;
            });
            return group;
        }
    };
    $.extend(WebOrders.db, db);
})();
