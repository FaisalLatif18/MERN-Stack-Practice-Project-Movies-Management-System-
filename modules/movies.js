
const moongse=require('mongoose');
const moviesSchema=moongse.Schema({
    name: {
        type:String,
        required:"This field is mandatory"
    },
    releaseDate:{
        type:String
    },
    director:{
        type:String
    }
});
module.exports = moongse.model("Movie",moviesSchema);
