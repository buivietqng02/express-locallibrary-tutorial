var mongoose= require('mongoose');
var {DateTime}= require('luxon');
var Schema= mongoose.Schema;
var AuthorSchema= new Schema({
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
});
//virtual for author fdill name
AuthorSchema
.virtual('name')
.get(function(){
    return this.family_name+', '+ this.first_name;
});
//virtual for author lifespan
AuthorSchema
.virtual('lifespan').get(function(){
var lifetime_string='';
if (this.date_of_birth) {
    lifetime_string= DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);

}lifetime_string+=' - ';
if (this.date_of_death) {
    lifetime_string+= DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
}
return lifetime_string;
});
//author url
AuthorSchema
.virtual('url')
.get(function(){
    return '/catalog/author/'+ this._id;

});
AuthorSchema
.virtual('date_of_birth_formatted')
.get(function(){
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});
AuthorSchema
.virtual('date_of_death_formatted')
.get(function(){
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});
//export model
module.exports= mongoose.model('Author', AuthorSchema);