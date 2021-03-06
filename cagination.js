/* Requirements */
var mongoose = require('mongoose');
var async = require('async');

/* Defaults */
var defaults = {
  perPage: 25
};

/* Exports */
module.exports = {

  /*
   * Find mongoose documents given a set of options
   * and return paginated results.
   *
   * @param  {Object} model
   * @param  {Object} options
   * @return {Object}
   */
  find: function(model, params, fn) {

    if (!params.currentPage) {
      return fn('caginate err: current page not provided.', null, null, null);
    }

    if (!params.populate) {
      params.populate = '';
    }

    var perPage;
    if (params.perPage) {
      perPage = params.perPage;
    } else {
      perPage = defaults.perPage;
    }

    async.parallel({

      // find the paginated documents in parallel
      findDocuments: function(callback) {
        model.find(params.options)
          .select(params.select)
          .populate(params.populate)
          .sort(params.sort)
          .skip((params.currentPage - 1) * perPage)
          .limit(perPage)

        .exec(function(err, documents) {
          if (err) {
            return callback(err, null);
          } else if (!documents) {
            return callback('Error finding paginated documents', null);
          }

          return callback(null, documents);
        });
      },

      // count the total documents in parallel
      countDocuments: function(callback) {

        model.count(params.options, function(err, count) {
          if (err) {
            return callback(err, null);
          } else if (count == null || count == undefined) {
            return callback('Error counting total documents', null);
          }

          var totalPages = Math.ceil(count / perPage);

          return callback(null, {
            count: count,
            totalPages: totalPages
          });
        });
      }

    }, function(err, results) {
      if (err) {
        return fn(err, null, null, null);
      }
      return fn(null, results.findDocuments, results.countDocuments.count, results.countDocuments.totalPages);
    });
  }
};
