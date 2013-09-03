var graphsrc = (function () {
    'use strict';

    var pub = {},
        $container,
        maxWidth,
        exampleSourceList;

    var templateHtml = function(exampleSources) {
        var options = "";
        for (var i = 0; i < exampleSources.length; i++) {
            var e = exampleSources[i];
            options += "<option value=" + i + ">" + e.name + "</option>";
        }

        return '<button id="hideSrc">hide</button>' +
               '<select id="exampleSelect">' + options + '</select>' +
               '<textarea overflow="auto" rows="40" cols="40" id="src"></textarea>';
    };

    var throttle = function(f, delay) {
        var timer = null;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = window.setTimeout(
                function() { f.apply(context, args); }, 
                delay || 500);
        };
    };

    var toggleSrc = function(srcHiddenCallback) {                  
        if ( $('#src').css('display') == 'none') {
            $('#src').toggle('slide', {"direction": "left"}, 100, function() {                        
                $('#hideSrc').text("hide");
                $('#exampleSelect').show();
                srcHiddenCallback();
            });
        }
        else {
            $('#src').toggle('slide', {"direction": "left"}, 100, function() {                        
                $('#hideSrc').text(">");
                $('#exampleSelect').hide();
                srcHiddenCallback();
            });
        }
    };

    pub.init = function(containerElementId, exampleSources, srcKeyUpCallback, srcHiddenCallback) {
        $container = $("#"+containerElementId);
        exampleSourceList = exampleSources;

        $container.html(templateHtml(exampleSources));
        $("#src").val(exampleSources[0].src);        

        $("#src").keyup(throttle(srcKeyUpCallback, 200));
        $('#hideSrc').click(function() { toggleSrc(srcHiddenCallback); });

        $('#exampleSelect').change(function() {
            var srcIndex = $(this).val();
            $("#src").val(exampleSources[srcIndex].src);
            srcKeyUpCallback();            
        });
    };

    pub.getSrc = function() { return $("#src").val(); };
    pub.setSrcOk = function() { $("#src").removeClass("error"); };
    pub.setSrcInvalid = function() { $("#src").addClass("error"); };

    return pub;
}());