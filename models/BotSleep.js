const { model, Schema } = require('mongoose')

module.exports = model("SellepingBot", new Schema({
    GuildID: String,
    UserID: String
}))