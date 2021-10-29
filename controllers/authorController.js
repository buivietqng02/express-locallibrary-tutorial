var Author= require('../models/author');
var async= require('async');
var Book= require('../models/book');
const {body, validationResult}= require('express-validator');
//display list all authors
exports.author_list= function(req, res) {
    Author.find()
    .sort([['family_name','ascending']])
    .exec(function(err, list_authors){
        if (err) {return next(err);}
        res.render('author_list', {title:'Author list', author_list: list_authors});
    });



};
//display detail about specific author

exports.author_detail= function(req, res) {

    async.parallel({
        author: function(callback){
            Author.findById(req.params.id)
            .exec(callback)
        },
        authors_books: function(callback) {
            Book.find({'author': req.params.id}, 'title summary')
            .exec(callback)
        }
    }, function(err, results){
        if (err) {return next(err);}
        if (results.author==null) {
            var err= new Error('author not found');
            err.status= 404;
            return next(err);

        }
        res.render('author_detail', {title: 'author detail', author: results.author,author_books:results.authors_books});
    });

}
//display author create form on get
exports.author_create_get= function(req, res) {
  res.render('author_form', {title:'create author'});

}
exports.author_create_post= [

    body('first_name').trim().isLength({min:1}).escape().withMessage('first name must be specified')
    .isAlphanumeric().withMessage('first name has non alpha character'),
    body('family_name').trim().isLength({min:1}).escape().withMessage('family name must be specified')
    .isAlphanumeric().withMessage('family name has non alpha character'),
    body('date_of_birth', 'invalid day of birth').optional({checkFalsy: true}).isISO8601().toDate(),
    body('date_of_death', 'invalid day of death').optional({checkFalsy: true}).isISO8601().toDate(),
    (req, res,next)=> {
        const errors= validationResult(req);
        if (!errors.isEmpty()) {
            res.render('author_form', {title: 'create author form', author: req.body, errors:errors.array()});
            return;
        }
        else {
            var author= new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth:req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function(err){
                if (err) {return next(err);}
                res.redirect(author.url);
            });
        }
    }

]

   


exports.author_delete_get= function(req, res) {
    res.send('not implemented author delete get');
}
exports.author_delete_post= function(req, res) {
    res.send('not implemented author delete post');
}
exports.author_update_get= function(req, res) {
    res.send('not implemented author update get');
}
exports.author_update_post= function(req, res) {
    res.send('not implemented author update post');
}
