window.WebOrders = window.WebOrders || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    // To customize the Generic theme, use the DevExtreme Theme Builder (http://js.devexpress.com/ThemeBuilder)
    // For details on how to use themes and the Theme Builder, refer to the http://js.devexpress.com/Documentation/Guide/#themes article

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if(window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !WebOrders.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }
    Globalize.culture("ru");

    WebOrders.app = new DevExpress.framework.html.HtmlApplication({
        namespace: WebOrders,
        layoutSet: DevExpress.framework.html.layoutSets[WebOrders.config.layoutSet],
        navigation: WebOrders.config.navigation,
        commandMapping: WebOrders.config.commandMapping
    });
    WebOrders.app.router.register(":view/:id", { view: "logOn", id: undefined });
    WebOrders.app.on("navigatingBack", onNavigatingBack);
    WebOrders.app.navigate();
});
