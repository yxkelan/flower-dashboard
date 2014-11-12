'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/overviewChart.html',
    'chartist'
    ],

function ($, _, Backbone, App, overviewChartTmpl, Chartist) {

    App.Views.OverviewChartView = Backbone.View.extend({

        el: '#overview-chart-container',

        template: _.template(overviewChartTmpl), 

        initialize: function (options) {
            this.dates = options.dates;
        },

        render: function () {
            var html = this.template();
            $(this.el).append(html);
            // Generate graph 
            console.log("Render chart view");
        },

        generateChart: function () {
            this.$chart = this.$el.find('.ct-chart');
            
            var extra = this.collection.extra,
                data = {
                    labels: this.dates,
                    series: [
                        {
                            name: 'Total',
                            data: extra['totalArray']
                        },
                        {
                            name: 'Sold',
                            data: extra['soldArray']
                        }
                    ]
                };

            this.$chart.addClass('overview-chart');

            new Chartist.Line('.overview-chart', data, {
                axisX: {
                    //showLabel:false,
                    showGrid:false
                },
                axisY: {
                    showLabel:false,
                    showGrid:false
                },
                low: 0,
                showArea: true,
                height: '250px',
            });

            this.bindEventsToChart();
        },

        highlightFirstNode: function () { 
            var $line = this.$chart.find('line.ct-point').filter(':first');

            $line.trigger('click');
        },

        bindEventsToChart: function () {
            var $chart = this.$chart,
                tableView = this.tableView,
                dates = this.dates,
                extra = this.collection.extra;

            var $tooltip = this.$chart
                .append('<div class="tooltip"></div>')
                .find('.tooltip')
                .hide();

            $chart.on('click', 'line.ct-point', function(event) {
                var $point = $(this),
                    value = $point.attr('ct:value'),
                    index = $point.attr('index'),
                    total = extra['totalArray'][index],
                    sold = extra['soldArray'][index],
                    date = dates[index];

                App.vent.trigger('updateViewByDate', date);

                var html = "<div>Total: <span>"+total+"</span></div>" + 
                           "<div>Sold: <span>"+sold+"</span></div>";

                var points = [],
                    $series = $chart.find('g.ct-series');
                
                $series.each(function(){
                    var $points = $(this).find('line.ct-point');

                    $points.animate({'stroke-width': '10px'}, 100, App.easeOutQuad);
                    $points.eq(index).animate({'stroke-width': '20px'}, 300, App.easeOutQuad);
                });

                $tooltip.html(html)
                    .css({
                        left: event.offsetX - $tooltip.width() / 2 + 12,
                        top: event.offsetY - $tooltip.height() - 40
                    })
                    .show();

            });
        },
    });
    
    return App.Views.OverviewChartView;
});