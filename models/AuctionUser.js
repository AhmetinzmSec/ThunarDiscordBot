const {model, Schema} = require('mongoose')

module.exports = model("AuctionUser", new Schema({
    User: String,
    Text: String,
}))