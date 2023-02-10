const { model, Schema } = require('mongoose')

module.exports = model("Care", new Schema({
    Enable: String,
}))