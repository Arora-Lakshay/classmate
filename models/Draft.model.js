const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const draftSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true,
  }
}, { timestamps: true });


const Draft = mongoose.model("Draft", draftSchema);
module.exports = Draft;
