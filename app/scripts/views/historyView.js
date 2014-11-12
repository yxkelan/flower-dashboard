'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/historyView.html',
    'chartist'
    ],    

function ($, _, Backbone, App, historyViewTmpl, Chartist) {

    App.Views.HistoryView = Backbone.View.extend({

        template: _.template(historyViewTmpl),

        className: 'col-md-7',

        initialize: function (options) {
            this.dates = options.dates;
            this.index = options.index;

            _.bindAll(this, "highlightBar");
            App.vent.on('updateViewByDate', this.highlightBar);
        },

        getSeries: function () {
            var items = [],
                flower = this.model;

            this.dates.forEach(function(date){
                items.push(flower.get(date)['daily%']);
            });

            return items;
        },

        render: function () {
            var type = this.model.get('type');
                    
            // This will be a simple bubble chart.
            this.$el.append(this.template({flower: type }));

            console.log("Render hisory view");
            return this.$el;
        },

        generateChart: function () {
            this.$chart = this.$el.find('.ct-chart');

            var index = this.index,
                items = this.getSeries(),
                data = {
                    labels: this.dates,
                    series: [
                        items
                    ]
                };

            this.$chart.addClass('history-chart-' + index);

            new Chartist.Bar('.history-chart-' + index, data);

            //this.bindEventsToChart();
        },

        highlightBar: function (date) {
            //debugger;
            var $bars = this.$chart.find('line.ct-bar');

            $bars.attr('class','ct-bar')
                .css({'stroke-width': '10px'});
            $bars.filter(function () {
                return $(this).attr('label') === date;
                })
                .attr('class','ct-bar highlight')
                .animate({'stroke-width': '20px'}, 300, App.easeOutQuad);
        },

        /*bindEventsToChart: function () {
            var dayView = this.dayView;

            this.$chart.on('click', 'line.ct-bar', function(event) {
                console.log('This bar is clicked', event);

                var $bar = $(this),
                    value = $bar.attr('ct:value'),
                    label = $bar.attr('label'),
                    seriesName = $bar.parent().attr('ct:series-name');

                $bar.animate({'stroke-width': '20px'}, 300, easeOutQuad);

                dayView.updateView(label);
            });
        }*/
    });

    return App.Views.HistoryView;

});