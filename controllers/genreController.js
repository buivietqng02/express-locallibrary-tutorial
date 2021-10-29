var Genre= require('../models/genre');
var Book= require('../models/book');
var async= require('async');
var {body, validationResult}= require('express-validator');

//display list all genres
exports.genre_list= function(req, res) {
    
    Genre.find()
    .sort([['name','ascending']])
    .exec(function(err, list_genres){
        if (err) {return next(err);}
        res.render('genre_list', {title: 'genre list', genre_list: list_genres});
    })



}
//display detail about specific genre
exports.genre_detail= function(req, res) {
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id)
            .exec(callback);
        },
        genre_books: function(callback){
            Book.find({'genre':req.params.id })
            .exec(callback);
        },
    }, function(err, results){
        if (err) {
            return next(err);
        }
        if (results.genre==null){
            var err= new Error('genre not found');
            err.status= 404;
            return next(err);
        }
        console.log(results.genre_books);
        res.render('genre_detail', {title: 'genre detail', genre: results.genre, genre_books: results.genre_books});

    })


}
//display genre create form on get
exports.genre_create_get= function(req, res) {
   res.render('genre_form', {title: 'create genre'});


}
exports.genre_create_post =
   

[
    body('name', 'genre name required').trim().isLength({min: 1}).escape(),
    (req, res, next)=> {
        const errors= validationResult(req);
        console.log(req.body.name);
        var genre= new Genre({name: req.body.name});
        if (!errors.isEmpty()) {
            res.render('genre_form', {title: 'create genre',genre: genre, errors: errors.array()});
            return;
        }
        else {
                Genre.findOne({'name': req.body.name})
                .exec(function(err, found_genre){
                     if (err) {return next(err);}
                     if (found_genre) {
                         res.redirect(found_genre.url);
                    }
                    else {
                     genre.save(function(err){
               
                     res.redirect(genre.url);
            });
        }
    })
}
    }
];

    


exports.genre_delete_get= function(req, res) {
    res.send('not implemented genre delete get');
}
exports.genre_delete_post= function(req, res) {
    res.send('not implemented genre delete post');
}
exports.genre_update_get= function(req, res) {
    res.send('not implemented genre update get');
}
exports.genre_update_post= function(req, res) {
    res.send('not implemented genre update post');
}
