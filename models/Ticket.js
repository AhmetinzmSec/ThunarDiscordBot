const { model, Schema } = require('mongoose')

module.exports = model("ticketssystem", new Schema({
    GuildID: String,
    UserID: String
}))