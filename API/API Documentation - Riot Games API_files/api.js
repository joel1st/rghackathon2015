var Docs = {

    shebang: function () {

        // If shebang has an operation nickname in it..
        // e.g. /docs/#!/words/get_search
        var fragments = window.location.hash.substring(3).split('/');

        switch (fragments.length) {
            case 1:
                // Expand all operations for the resource and scroll to it
//				log('shebang resource:' + fragments[0]);
                var dom_id = 'resource_' + fragments[0];

                Docs.expandEndpointListForResource(fragments[0]);
                $("#" + dom_id).slideto({highlight: false});
                break;
            case 2:
                // Refer to the endpoint DOM element, e.g. #words_get_search
//				log('shebang endpoint: ' + fragments.join('_'));

                var dom_id = 'resource_' + fragments[0];

                // Expand Resource
                Docs.expandEndpointListForResource(fragments[0]);
                $("#" + dom_id).slideto({highlight: false});

                // Expand operation
                var li_content_dom_id = fragments[1] + "_content";

//                log("li_dom_id " + li_dom_id);
//                log("li_content_dom_id " + li_content_dom_id);

                Docs.expandOperation($('#' + li_content_dom_id));
                $('#' + li_content_dom_id).slideto({highlight: false});
                break;
        }

    },

    toggleEndpointListForResource: function (resource) {
        var elem = $('li#resource_' + Docs.escapeResourceName(resource) + ' ul.endpoints');
        if (elem.is(':visible')) {
            Docs.collapseEndpointListForResource(resource);
        } else {
            Docs.expandEndpointListForResource(resource);
        }
    },

    // Expand resource
    expandEndpointListForResource: function (resource) {
        var resource = Docs.escapeResourceName(resource);
        $('li#resource_' + resource).addClass('active');

        var elem = $('li#resource_' + resource + ' ul.endpoints');
        elem.slideDown();
    },

    // Collapse resource and mark as explicitly closed
    collapseEndpointListForResource: function (resource) {
        var resource = Docs.escapeResourceName(resource);
        $('li#resource_' + resource).removeClass('active');

        var elem = $('li#resource_' + resource + ' ul.endpoints');
        elem.slideUp();
    },


    /* added by lestes */
    jumpToResource: function (div) {
        var elem = $(div);
        // console.log(elem);

        elem.slideto({highlight: false});
    },

    /* added by mroot */
    toggleOperationForResource: function (methodId) {
        var elem = $('div#' + methodId + "_content");
        // console.log(elem);

        if (elem.is(':visible')) {
            Docs.collapseOperation(elem);
        } else {
            Docs.expandOperation(elem);
        }
        elem.slideto({highlight: false});
    },

    expandOperationsForResource: function (resource) {
        // Make sure the resource container is open..
        Docs.expandEndpointListForResource(resource);

        $('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function () {
            Docs.expandOperation($(this));
        });
    },

    collapseOperationsForResource: function (resource) {
        // Make sure the resource container is open..
        Docs.expandEndpointListForResource(resource);

        $('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function () {
            Docs.collapseOperation($(this));
        });
    },

    escapeResourceName: function (resource) {
        return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&");
    },

    expandOperation: function (elem) {
        elem.slideDown();
    },

    collapseOperation: function (elem) {
        elem.slideUp();
    },

    /* added by mroot (not used) */
    formatResponse: function (methodId) {
        var prettyJson;

        var elem = $('div#' + 'response_' + methodId + '_body');

        // prettyJson = JSON.stringify(elem.html(), null, "\t").replace(/\n/g, "<br>");
        // elem.html(prettyJson);
    },

    switchToDescription: function (methodId, parameterId) {
        $("div#" + parameterId + "_description").css("display", "block");
        $("div#" + parameterId + "_snippet").css("display", "none");

        $("a#" + parameterId + "_description_menu").addClass("selected");
        $("a#" + parameterId + "_snippet_menu").removeClass("selected");

        $("div#" + methodId + "_content").slideto({highlight: false});
    },

    switchToSnippet: function (methodId, parameterId) {
        $("div#" + parameterId + "_description").css("display", "none");
        $("div#" + parameterId + "_snippet").css("display", "block");

        $("a#" + parameterId + "_description_menu").removeClass("selected");
        $("a#" + parameterId + "_snippet_menu").addClass("selected");

        $("div#" + methodId + "_content").slideto({highlight: false});
    },

    populateSnippet: function (parameterId) {
        var elem = $("textarea#" + parameterId + "_textarea");
        elem.val($("code#" + parameterId + "_json").text());
        elem.height(elem.attr('scrollHeight'));
    }
};
