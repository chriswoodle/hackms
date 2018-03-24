const scraper = require('./scraper');
const geo = require('./geo');
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

const team = {
    'chriswoodle': {},
    'ptarsoly': {},
    'jemsbhai': {},
    'cwille2012': {}
};
let hackathons = {};
scraper.fetchTeam(team).then(data => {
    // console.log(data.team);
    // console.log(data.hackathons);
    hackathons = data.hackathons;
    return scraper.fetchEvents(hackathons);
}).then(() => {
    return geo.geocodeEvents(hackathons);
}).then(() => {
    console.log(team);
    console.log(hackathons);

});
app.get('/hackathons', (req, res) => res.send(JSON.stringify(hackathons)))


app.listen(3000, () => console.log('Example app listening on port 3000!'))
