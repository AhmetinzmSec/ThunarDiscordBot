const { model, Schema } = require('mongoose')

module.exports = model("usupress", new Schema({
    Sebep: String,
    Code: String,
    Ekleyen: String,
    GuildID: String,
    UserID: String,
}))