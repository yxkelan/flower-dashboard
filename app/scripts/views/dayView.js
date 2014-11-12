'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/dayView.html',
    'text!templates/dayRecordView.html',
    'chartist'
    ],    

function ($, _, Backbone, App, dayViewTmpl, dayRecordTmpl, Chartist) {

    App.Views.DayView = Backbone.View.extend({

        className: 'col-md-5 day-view-container',

        template: _.template(dayViewTmpl),

        partialTemplate: _.template(dayRecordTmpl),

        initialize: function (options) {
            this.index = options.index;
            this.dataToShow = {};

            _.bindAll(this, "updateView");
            App.vent.on('updateViewByDate', this.updateView);
        },

        updateView: function (date) {
            this.dataToShow = this.model.get(date);

            this.renderTable();
            this.generateChart();
        },

        render: function () {
            // This will be a pie chart.
            this.$el.append(this.template());

            this.$table = this.$el.find('.day-record-table');
            this.renderTable();

            return this.$el;
        },

        renderTable: function () {
            var dataToShow = this.dataToShow;

            dataToShow['formattedDaily%'] = App.formatPercentage(dataToShow['daily%']);
            var html = this.partialTemplate({item: dataToShow});

            this.$table.html(html); 
        },

        getData: function () {
            var items = [];

            items.push(this.dataToShow.sold);
            items.push(this.dataToShow.unsold);

            return items;
        },

        generateChart: function () {
            var $chart = this.$el.find('.ct-chart'),
                index = this.index,
                items = this.getData(),
                data = {
                    labels: ['Sold', 'Unsold'],
                    series: items
                };

            $chart.addClass('day-chart-' + index);

            new Chartist.Pie('.day-chart-' + index, data, {
                width: '100px',
                height: '100px',
                donutWidth: '40px',
                labelInterpolationFnc: function(value) {
                    return value;
                }
            });
        }

    });

    return App.Views.DayView;
    
});