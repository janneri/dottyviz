var graph = (function () {
    'use strict';

    var pub = {},
        $container,
        maxWidth;

    pub.setMaxWidth = function(maxWidth) {
        $container.css("max-width", maxWidth);
    };

    pub.draw = function(src, successCallback, errorCallback) {
        try {            
            /*jshint newcap:false*/
            $container.html(Viz(src, "svg"));
            successCallback();
        } catch (err) {
            console.log(err);
            errorCallback();
        }
    };   

    pub.init = function(containerElementId) {
        $container = $("#"+containerElementId);
    };

    return pub;
}());