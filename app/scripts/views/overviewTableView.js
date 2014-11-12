'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/overviewTable.html'
    ],

function ($, _, Backbone, App, overviewTableTmpl) {

    App.Views.OverviewTableView = Backbone.View.extend({

        el: '#overview-table-container',

        template: _.template(overviewTableTmpl),

        initialize: function  (options) {
            this.types = options.types;
            this.dataToShow = [];
            this.selectedDate = null;

            _.bindAll(this, "updateView");
            App.vent.on('updateViewByDate', this.updateView);
        },

        updateView: function (date) {
            var items = [],
                flowers = this.collection;

            flowers.each(function (flower) {
                items.push(flower.get(date));
            });

            this.dataToShow = items;
            this.selectedDate = date;
            this.render();
        },

        render: function () {
            var dataToShow = this.dataToShow,
                date = this.selectedDate;

            this.$el.empty().append(this.template({items: dataToShow , date: date}));

            console.log("Render table view");
            return this.$el;
        }

    });

    return App.Views.OverviewTableView;

});