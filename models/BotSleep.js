const { model, Schema } = require('mongoose')

module.exports = model("SleepingBot", new Schema({
    GuildID: String,
    UserID: String
}))