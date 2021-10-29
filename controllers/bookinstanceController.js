var BookInstance= require('../models/bookinstance');
var Book= require('../models/book');
var {body, validationResult}= require('express-validator');
//display list all bookinstances
exports.bookinstance_list= function(req, res) {
   
    BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances){
        if (err) {
            return next(err);
        }
        res.render('bookinstance_list', {title: 'list book instance', bookinstance_list:list_bookinstances});
    })
}
//display detail about specific bookinstance
exports.bookinstance_detail= function(req, res) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance){
        if (err) {return next(err);}
        if (bookinstance==null) {
            var err= new Error('not found');
            err.status= 404;
            return next(err);
        }
        res.render('bookinstance_detail', {title: 'copys;'+ bookinstance.book.title,bookinstance: bookinstance});

    })

    
}
//display bookinstance create form on get
exports.bookinstance_create_get= function(req, res) {
    Book.find({},'title')
    .exec(function(err, books){
        if (err) {return next(err);}
        res.render('bookinstance_form', {title:'create book instance', book_list: books});  
        for(var book of books) {
            console.log(book+'\n');
        }     
    })


}
    exports.bookinstance_create_post= [
        body('book', 'book must be specified').trim().isLength({min: 1}).escape(),
        body('imprint', 'imprint must be specified').trim().isLength({min:1}).escape(),
        body('status').escape(),
        body('due_back','invalid date').optional({checkFalsy:true}).isISO8601().toDate(),
        (req, res, next)=> {
            const errors=validationResult(req);
            var bookinstance= new BookInstance({
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            });
            if (!errors.isEmpty()) {
                Book.find({}, 'title')
                .exec(function(err, books){
                    if (err) {return next(err);}
                    res.render('bookinstance_form', {title: 'create bookinstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance});


                });
                return;
            }
            else {
                bookinstance.save(function(err){
                    if (err) {return next(err);}
                   res.redirect(bookinstance.url);
                })
            }    
        }
    ]
   


exports.bookinstance_delete_get= function(req, res) {
    res.send('not implemented bookinstance delete get');
}
exports.bookinstance_delete_post= function(req, res) {
    res.send('not implemented bookinstance delete post');
}
exports.bookinstance_update_get= function(req, res) {
    res.send('not implemented bookinstance update get');
}
exports.bookinstance_update_post= function(req, res) {
    res.send('not implemented bookinstance update post');
}
