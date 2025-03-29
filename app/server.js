const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment');

// Set mongoose options to disable buffering
mongoose.set('bufferCommands', false);

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
// Bento Layout route
const BentoLayoutRouter = require('./routes/bento-layout');
// Bento Merged Dashboard route
const BentoMergedRouter = require('./routes/bento-merged');
// Unified Bento Dashboard route
const UnifiedBentoRouter = require('./routes/unified-bento');

// Set ejs template engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectLiveReload());

app.use(bodyParse.urlencoded({ extended: false }));
app.locals.moment = moment;

// Database connection with retry logic
try {
    const db = require('./config/keys').mongoProdURI;
    const connectWithRetry = () => {
        mongoose
            .connect(db, { 
                useNewUrlParser: true, 
                serverSelectionTimeoutMS: 5000,
                bufferCommands: false 
            })
            .then(() => console.log(`MongoDB Connected`))
            .catch(error => {
                console.log(`MongoDB Connection Error: ${error.message}. Retrying in 5 seconds...`);
                setTimeout(connectWithRetry, 5000);
            });
    };
    connectWithRetry();
} catch (err) {
    console.log(`MongoDB Error: ${err.message}. Continuing without database...`);
}

app.use(FrontRouter);
app.use('/bento', BentoRouter);
app.use('/bento-layout', BentoLayoutRouter);
app.use('/bento-merged', BentoMergedRouter);
app.use('/dashboard', UnifiedBentoRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});