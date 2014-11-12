// App.js
// Defines a global object App.

'use strict';

define([
    'jquery',
    'underscore',
    'backbone'
    ],

function ($, _, Backbone) {

    var App = {
        Views: {},
        Models: {},
        Collections: {}
    };

    /******** Private functions *********/

    // Get data from json file
    function getFlowersData () {
        var defer = new $.Deferred();

        $.getJSON('data.json', function(data){
            defer.resolve(data);
        }).fail(function(){
            defer.resolve(null);
        });

        return defer.promise();
    }

    // Group data by flower type 
    function processData (data) {
        var flowersMap = {},
            flowers = [],
            dateMap = {},
            dates = [],
            types = [];

        data.forEach(function (item) {
            var date = item.date,
                flower = item.flower,
                sold = parseInt(item['quantity-sold']),
                unsold = parseInt(item['quantity-unsold']),
                total = sold + unsold;
             
            if (typeof flowersMap[flower] == "undefined") {
                flowersMap[flower] = {};
                flowersMap[flower]['list'] = [];
                types.push(flower);
            }

            if (typeof dateMap[date] == 'undefined') {
                dateMap[date] = 1;
                dates.push(date);
            }

            flowersMap[flower][date] = {
                flower: flower,
                total: total, 
                sold: sold,
                unsold: unsold,
                'daily%': (sold/total)
            };
        });


        types.forEach(function (type) {
            flowers.push(flowersMap[type]);
        });

        dates.sort(compare);

        return {    
            flowers: flowers, 
            types: types, 
            dates:dates
        };
    }

    // Comparator for array sort function
    function compare (a, b) {
        var aDate = new Date(a),
            bDate = new Date(b);
          
        if ( (aDate - bDate) > 0) {
            return 1;
        }
          
        if ( (aDate - bDate) < 0) {
            return -1;
        }
          
        return 0;
    }


    /******** Public Methods ***********/

    // Create event aggregator
    App.vent = _.extend({}, Backbone.Events); 

    // Utility function
    App.formatPercentage = function (d, format) {
        return (d * 100).toFixed(0) + '%';
    }

    App.easeOutQuad = function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };

    // Start app
    App.start = function () {

        // Get data from server side
        var fetchingData = getFlowersData();

        $.when(fetchingData).done(function (data) {
            App.data = processData(data);
            console.log(App.data);

            require(['views/appView','collections/flowers'], function () {
                var flowers = new App.Collections.Flowers(App.data.flowers,{
                        dates: App.data.dates
                    }),
                    appView = new App.Views.AppView({
                        collection: flowers,
                        dates: App.data.dates,
                        types: App.data.types
                    });

                appView.render();
            });

        });
    }
    
    return App;
});