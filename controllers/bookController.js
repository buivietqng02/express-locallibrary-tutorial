var Book= require('../models/book');
var Author= require('../models/author');
var Genre= require('../models/genre');
var BookInstance= require('../models/bookinstance');
var async= require('async');
const {body, validationResult}= require('express-validator');
//display list all books
exports.index= function(req, res){
   async.parallel({
       book_count: function(callback) {
           Book.countDocuments({}, callback);
       },
       book_instance_count: function(callback) {
        BookInstance.countDocuments({}, callback)},
       book_instance_available_count: function(callback) {
           BookInstance.countDocuments({status: 'Available'}, callback);
       },
       author_count: function(callback) {
           Author.countDocuments({}, callback);

       },
       genre_count: function(callback) {
           Genre.countDocuments({}, callback);
       }

   }, function(err, results){
    res.render('index', {title: 'local library home', error: err, data: results});
   }
   );
   
   console.log('input');
}
exports.book_list= function(req, res) {



    Book.find({}, 'title author')
    .sort({title: 1})
    .populate('author')
    .exec(function(err, list_books){
        if (err) {return next(err);}
        res.render('book_list', {title: 'book lists', book_list: list_books});
    });
    
}
//display detail about specific book
exports.book_detail= function(req, res) {
async.parallel({
    book: function(callback){
        Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback){
        BookInstance.find({'book': req.params.id})
        .exec(callback);
    },
}, function(err, results){
    if (err) {return next(err);
    }
    if (results.book==null) {
        var err=new Error('book not found');
        err.status=404;
        return next(err);
    }
    res.render('book_detail', {title: results.book.title, book: results.book, book_instances: results.book_instance});
})  


}
//display book create form on get
exports.book_create_get= function(req, res) {
    
async.parallel({
    authors: function(callback){
        Author.find(callback);
    },
    genres: function(callback){
        Genre.find(callback);
    },

}, function(err, results){
    if (err) {return next(err);}
    res.render('book_form', {title: 'createw book', authors: results.authors, genres: results.genres});
});

}
exports.book_create_post= [
    (req, res, next)=> {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre==='undefined'){
                req.body.genre=[];
            } else {
                req.body.genre= new Array(req.body.genre);
            }
        }
        next();
    },
    body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
    body('author', 'author must not be empty').trim().isLength({min:1}).escape(),
    body('summary', 'summary must not be empty').trim().isLength({min:1}).escape(),
    body('isbn', 'isbn must not be empty').trim().isLength({min:1}).escape(),
    body('genre.*').escape(),
    (req, res, next)=> {
        const errors= validationResult(req);
        var book= new Book({
            title: req.body.title,
            author: req.body.author,
            summary:req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });
        if (!errors.isEmpty()) {
            async.parallel({
                authors: function(callback){
                    Author.find(callback);
                },
                genres: function(callback){
                    Genre.find(callback);
                },

            } , function(err, results){
                if (err) {return next(err);}
                for (let i=0;i<results.genres.length;i++){
                    if (book.genre.indexOf(results.genres[i]._id)>-1){
                        results.genres[i].checked= 'true';
                    }

                }
                res.render('book_form', {title: 'createw book', authors:results.authors, genres: results.genres, book: book,errors:errors.array(),summary:req.body.summary,title:req.body.title});


            }  );
            return;

        } //end if
        else {
            book.save(function(err){
                if (err) {return next(err);}
                res.redirect(book.url);
            });
        }
    }
]
   


exports.book_delete_get= function(req, res) {
    res.send('not implemented book delete get');
}
exports.book_delete_post= function(req, res) {
    res.send('not implemented book delete post');
}
exports.book_update_get= function(req, res) {
    res.send('not implemented book update get');
}
exports.book_update_post= function(req, res) {
    res.send('not implemented book update post');
}
