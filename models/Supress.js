const { model, Schema } = require('mongoose')

module.exports = model("supress", new Schema({
    Sebep: String,
    Code: String,
    Ekleyen: String,
    UserID: String,
}))