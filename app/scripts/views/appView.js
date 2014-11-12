'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/appView.html',
    'models/flower',
    'views/overviewChartView',
    'views/overviewTableView',
    'views/historyView',
    'views/dayView'
    ],

function ($, _, Backbone, App, appViewTmpl) {

    App.Views.AppView = Backbone.View.extend({

        el: '#app-view',

        template: _.template(appViewTmpl),

        initialize: function(options){
            this.dates = options.dates;
            this.types = options.types;
        },

        render: function () {
            this.collection.generateExtraData();
            this.$el.append(this.template());

            this.renderOverview();
            this.renderList();

            var overviewChartView = this.overviewChartView;
            setTimeout(function () {
                overviewChartView.highlightFirstNode();
            }, 500); 
        },

        renderOverview: function () {
            var flowers = this.collection,
                dates = this.dates,
                types = this.types;

            var overviewTableView = new App.Views.OverviewTableView({
                    collection: flowers,
                    types: types
                }),
                overviewChartView = new App.Views.OverviewChartView({
                    collection: flowers,
                    dates: dates
                });

            this.overviewChartView = overviewChartView;
            overviewChartView.render();
            overviewTableView.render();

            overviewChartView.generateChart();
        },

        renderList: function () {
            // render list views
            var flowers = this.collection,
                dates = this.dates,
                types = this.types,
                $list = this.$el.find('#list')

            flowers.each(function (flower, index) {
                flower.set('type', types[index]);

                var dayView = new App.Views.DayView({
                        model: flower,
                        index: index
                    }),
                    historyView = new App.Views.HistoryView({
                        model: flower,
                        dates: dates,
                        index: index
                    });

                var $item = $('<li class="row"></li>');
                
                $item.append(historyView.render())
                    .append(dayView.render());
                $list.append($item);

                historyView.generateChart();
            });
        }

    });

    return App.Views.AppView;
});