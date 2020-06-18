const {Schema, model} = require('mongoose');


const schema = new Schema({
  gameId:{
    type: String,
    
  },
  player : {type: String},
  turn: {type: String},
  time: {
    type:Date,
    default: Date.now,
  },
  
},
{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = model('Turns', schema)