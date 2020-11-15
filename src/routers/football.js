const  request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')

var sqlQuery = '';

async function getLeague() {
    try {
        const response = await axios.get('https://dailyathon.herokuapp.com/league');
        response.data.forEach(element => {
                LeagueData(element);
            }
        )
    } catch (error) {
        console.error(error);
    }
}


async function setLeagueData(legueUrl,leagueName) {
    await axios.post('https://dailyathon.herokuapp.com/league-standings', {
        query:sqlQuery
    })
        .then(function (response) {
            log.createLog('Football Bot',legueUrl,leagueName+ ' League information added successfully.',' ');
            console.log(response.status);
        })
        .catch(function (error) {
            log.createLog('Football Bot',legueUrl,leagueName+ ' League information added failed.',error.message);
            console.log(error);
        });
}

function insertSql(SequenceNo,TeamName,TeamLogoUrl,_O,_G,_B,_M,_A,_Y,_AV,_P,LeagueID) {
    var sql = mysql.format("INSERT INTO tblFootball SET  SequenceNo=" + mysql.escape(SequenceNo) + ", TeamName=" + mysql.escape(TeamName) +
    ", TeamLogoUrl=" + mysql.escape(TeamLogoUrl) +", O=" +  mysql.escape(_O) 
    +", G=" + mysql.escape(_G) + ", B=" + mysql.escape(_B)+", M=" + mysql.escape(_M) + ", A=" + mysql.escape(_A)+", Y=" + mysql.escape(_Y) + ", AV=" + mysql.escape(_AV)
    +", P=" + mysql.escape(_P) + ", LeagueID=" + mysql.escape(LeagueID));
    sqlQuery += sql+"; "
}


async function updateLeagueData(legueUrl,leagueName) {
    await axios.put('https://dailyathon.herokuapp.com/league-standings', {
        query:sqlQuery
    })
    .then(function (response) {
        log.createLog('Football Bot',legueUrl,leagueName+ ' League information added successfully.',' ');
        console.log(response.status);
    })
    .catch(function (error) {
        log.createLog('Football Bot',legueUrl,leagueName+ ' League information added failed.',error.message);
        console.log(error);
    });
}


function updateSql(SequenceNo,TeamName,TeamLogoUrl,_O,_G,_B,_M,_A,_Y,_AV,_P,LeagueID) {
    var sql = mysql.format("UPDATE tblFootball SET  "+ "TeamName=" + mysql.escape(TeamName) +
    ", TeamLogoUrl=" + mysql.escape(TeamLogoUrl) +", O=" + mysql.escape(_O) 
    +", G=" + mysql.escape(_G) + ", B=" + mysql.escape(_B)+", M=" + mysql.escape(_M) + ", A=" + mysql.escape(_A)+", Y=" + mysql.escape(_Y) + ", AV=" + mysql.escape(_AV)
    +", P=" + mysql.escape(_P) + "WHERE LeagueID=" + mysql.escape(LeagueID)+" and SequenceNo="+ mysql.escape(SequenceNo));
    sqlQuery += sql+"; "
}


function LeagueData(data) {
    request(data.LeagueUrl, function (error, response, html) {
        if(data.SportID == 1)
        {
            if (! error && response.statusCode == 200 ) {
                const $ = cheerio.load(html);
                $ ('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status').each(function(i, element){
                    const SequenceNo = $ (this).find('span.p0c-competition-tables__rank').text();
                    const TeamName = $ (this).find('img.p0c-competition-tables__crest').attr('src');
                    const TeamLogoUrl = $ (this).find('span.p0c-competition-tables__team-name.p0c-competition-tables__team-name--full').text();
                    const O = $ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(3).text();
                    const G =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(5).text();
                    const B =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(6).text();
                    const M =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(7).text();
                    const A =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(8).text();
                    const Y =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(9).text();
                    const AV =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(10).text();
                    const P =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(11).text();
                    updateSql(SequenceNo,TeamLogoUrl,TeamName,O,G,B,M,A,Y,AV,P,data.LeagueID)
                });
                updateLeagueData(data.LeagueUrl,data.LeagueName);
                sqlQuery='';
            }
            else
            {
                log.createLog('Football Bot',legueUrl,leagueName+ ' League url error','League url error');
            }
        }
        else
        {
            console.log("Sport name is not football !")
        }

    });
}

const hours = (1000 * 60 * 60 * 4);
//setInterval(getLeague, hours);
setTimeout(getLeague,1000)