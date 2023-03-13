const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const {MONGODB_URI} = process.env

exports.connect = () => {
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(
            console.log(`DB connected successfully`))
        .catch(error => {
            console.log(`DB connection failed`);
            console.log(error);
            process.exit(1)
        });
};
