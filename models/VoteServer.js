const { model, Schema } = require('mongoose')

module.exports = model("vsrv", new Schema({
    GuildID: String,
    UserID: String,
    Vote: String
}))