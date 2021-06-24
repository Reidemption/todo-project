const mongoose = require("mongoose");
const db = mongoose.connection;

function connect() {
    let connectionString = `mongodb+srv://reid_gubler:AHg0i8fGhb8Gh8va@cluster0.tmhn8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    console.log("connecting to db..");
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => {
        console.log("Error connecting to mongo: ",err);
    })
};

function onConnect(callback) {
    db.once("open", callback);
}

module.exports = {
    connect,
    onConnect,
}