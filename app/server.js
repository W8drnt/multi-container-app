const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const app = require('express')();
const moment = require('moment');

// Live Reload configuration
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Fontend route
const FrontRouter = require('./routes/front');
// Bento UI route
const BentoRouter = require('./routes/bento');
// Bento Layout System route
const BentoLayoutRouter = require('./routes/bento-layout');
// Merged Bento Dashboard route
const BentoMergedRouter = require('./routes/bento-merged');

// Set ejs template engine
app.set('view engine', 'ejs');

app.use(connectLiveReload())

app.use(bodyParse.urlencoded({ extended: false }));
app.locals.moment = moment;

// Database connection
const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));


app.use(FrontRouter);
app.use('/bento', BentoRouter);
app.use('/bento-layout', BentoLayoutRouter);
app.use('/bento-merged', BentoMergedRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});