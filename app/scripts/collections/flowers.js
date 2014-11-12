'use strict';

define([
    'app',
    'models/flower'
    ],

function (App) {

    App.Collections.Flowers = Backbone.Collection.extend({

        model: App.Models.Flower,

        initialize: function (models, options) {
            this.dates = options.dates;
        },

        generateExtraData: function () {
            var self = this,
                dates = this.dates,
                totalArray = [],
                soldArray = [],
                unsoldArray = [];

            dates.forEach(function (date) {
                var totalSum = 0,
                    soldSum = 0,
                    unsoldSum = 0;

                self.each(function (flower) {
                    var flowerData = flower.get(date);

                    totalSum += flowerData.total;
                    soldSum += flowerData.sold,
                    unsoldSum += flowerData.unsold;
                });

                totalArray.push(totalSum);
                soldArray.push(soldSum);
                unsoldArray.push(unsoldSum);
            });

            dates.forEach(function(date, index){

                self.each(function (flower) {
                    var flowerData = flower.get(date);

                    // TODO: consider corner case, and remove 0 case
                    flowerData['total%'] = App.formatPercentage(flowerData['total']/ totalArray[index]);
                    flowerData['sold%'] = App.formatPercentage(flowerData['sold'] / soldArray[index]);
                    flowerData['unsold%'] = App.formatPercentage(flowerData['unsold']/ unsoldArray[index]);
                });
            });

            self.extra = {
                totalArray : totalArray,
                soldArray : soldArray,
                unsoldArray : unsoldArray
            }

            console.log("The model with extra data", self.extra);
        }

    });

    return App.Collections.Flowers;
});