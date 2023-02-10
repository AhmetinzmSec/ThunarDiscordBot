const { model, Schema } = require('mongoose')

module.exports = model("adb", new Schema({
    GuildID: String,
}))