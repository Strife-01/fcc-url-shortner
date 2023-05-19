require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true })); // allows express to parse the url that it gets from the post request

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
    const url = req.body.url;

    if (!url.includes('https://') && !url.includes('http://'))
        return res.json({ error: 'invalid url' });

    if (originalUrls.indexOf(url) >= 0) {
        const j = originalUrls.indexOf(url);
        return res.json({
            original_url: originalUrls[j],
            short_url: shortUrls[j],
        });
    } else {
        originalUrls.push(url);
        shortUrls.push(shortUrls.length);
        return res.json({
            original_url: url,
            short_url: shortUrls.length - 1,
        });
    }

    // url
});

app.get('/api/shorturl/:shortCut', (req, res) => {
    let shortCut = req.params.shortCut;
    let originalUrl = originalUrls[shortUrls.indexOf(Number(shortCut))];
    if (originalUrl != null) {
        res.redirect(originalUrl);
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
