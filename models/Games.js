const {Schema, model} = require('mongoose');


const schema = new Schema({
  dateRegistration:{
    type:Date,
    default: Date.now,
  },
  position : {
    type: Array,
    default: [
      ['', '', '',],
      ['', '', '',],
      ['', '', '',],
    ]
  }
  
},
{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = model('Game', schema)