/*global require*/
'use strict';

require.config({
    baseUrl: '../',

    paths: {
        jquery: 'scripts/vendor/jquery',
        underscore: 'scripts/vendor/underscore',
        backbone: 'scripts/vendor/backbone',
        text: 'scripts/vendor/text',
        chartist: 'scripts/vendor/chartist',

        main: 'scripts/main',
        app: 'scripts/app',
        models: 'scripts/models',
        collections: 'scripts/collections',
        views: 'scripts/views',
        templates: 'templates'
    },

    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps:[
                'jquery', 
                'underscore'
            ],
            exports: 'Backbone' 
        },
        chartist: {
            exports: 'Chartist'
        }
    },

    name: 'scripts/vendor/almond'
});

require([
    'app'
], function (App) {
    App.start();
});
