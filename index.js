const app = require('./app')
const {PORT} = process.env

app.listen(8060, () => console.log(`Server is running at port ${PORT}...`));
