[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# Cagination

A Mongoose helper to simplify the pagination process.

## The Old, Painful Way
    var currentPage = data.currentPage;
    var perPage = data.perPage;
    var options = {
        actorId: nicCage._id
    };

    Film.find(options).select('name actorId').populate({
        path: 'actorId',
        select: 'lastName'
    }).sort({
        name: -1
    }).skip((currentPage - 1) * perPage).limit(perPage).exec(function(err, stars) {
        Film.count(options).exec(function(err, count) {
            var totalPages = Math.ceil(count / perPage);
            // return stars and totalPages
        });
    });

    
NOT THE PAGES! NOT THE PAGES! AGWHGHAHGHAA THEY'RE CLOGGING MY CODE!
    
Of course this is quite a mess, and painful to rewrite for each query you need paginated. Although the .count() procedure is pretty quick, to make this really efficient, you would need to also utilize the async module and perform that operation in parallel with the find(). But then you have a real disaster on your hands for such a simple task.

## The Cage Rage Way

Caginate aims to be robust but reproducible. Like your standard find() query, Caginate can accept the same options for select, populate, and sort. However, Caginate handles all of the bothersome math and manual skipping/limiting needed to get a paginated return. Additionally, it asynchronously grabs the total document count in order to provide you with the total number of pages.

    var currentPage = data.currentPage;
    var perPage = data.perPage;
    var options = {
        firstName: 'Nicolas'
    };

    caginate(Film, {
        options: options,
        select: 'name actorId',
        populate: {
            path: 'actorId',
            select: 'lastName'
        },
        sort: {
            name: -1
        },
        perPage: perPage,
        currentPage: currentPage
    }).exec(function(err, stars, count, totalPages) {
        // return stars and totalPages
    });

### Setup and Options

Get the source from [GitHub](https://github.com/hemphillcc/cagination) or install via NPM

    npm install cagination --save

Make sure to add:

    var caginate = require('caginate').find;
    
and you should be set. At any time you want paginated results, replace your Mongoose ``Model.find(query, callback)`` with ``caginate(Model, query, callback)``.

The Caginate query is an object consisting of:

* options (optional)
* select (optional)
* populate (optional)
* sort (optional)
* perPage (optional - defaults to 25 - how many documents to get back per page)
* currentPage (required - the page to retrieve documents for)

### Callback

The Caginate callback will look something like:

    caginate(Model, {
        perPage: 10,
        currentPage: 1
    }, function(err, documents, count, totalPages) {
        if(err) {
            // handle the Mongoose error
        }
        // documents - documents matching query but limited by perPage
        // count - the total number of documents matching your query
        // totalPages - the total number of pages needed to fit all of the documents at 10 per page
    });

## Version History

* 0.1.0 Initial release

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: https://github.com/hemphillcc/cagination/blob/master/LICENSE

[npm-url]: https://npmjs.org/package/cagination
[npm-version-image]: http://img.shields.io/npm/v/cagination.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/cagination.svg?style=flat

[travis-url]: http://travis-ci.org/hemphillcc/cagination
[travis-image]: http://img.shields.io/travis/hemphillcc/cagination/develop.svg?style=flat