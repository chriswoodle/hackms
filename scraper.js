const cheerio = require('cheerio');
const async = require('async');
const request = require('request');


const hackathons = {};

exports.fetchTeam = function (team) {
    return new Promise((resolve, reject) => {
        async.forEachOf(team, (value, key, cb) => {
            value.hackathons = {};
            request(`https://devpost.com/${key}/challenges`, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    $('.challenge-listing').each(function (index, element) {
                        const title = $(element).find('.challenge-synopsis .title').text().trim();
                        const hyperlink = $(element).find('a').attr('href').toString();
                        const hackathon = hyperlink.match(/https:\/\/([\w-]+)/)[1];
                        value.hackathons[hackathon] = title;
                        if (!hackathons[hackathon]) {
                            hackathons[hackathon] = {
                                title: title,
                                url: hyperlink
                            }
                        }
                    });
                }
                cb();
            });
        }, () => {
            resolve({ team, hackathons });
        });
    });
}

exports.fetchEvents = function (hackathons) {
    return new Promise((resolve, reject) => {
        async.forEachOf(hackathons, (value, key, cb) => {
            request(`https://${key}.devpost.com/`, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const address = $('#challenge-information .location a').text();
                    console.log(address)
                    hackathons[key].address = address;
                }
                cb();
            });
        }, () => {
            resolve();
        });
    });
};
