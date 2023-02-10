const {model, Schema} = require('mongoose')

module.exports = model("AuctionDB", new Schema({
    User: String,
    GuildID: String,
    Most: String,
    ChannelID: String,
}))