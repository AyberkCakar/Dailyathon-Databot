const  request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const mysql = require('mysql');

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

/*
async function setLeagueData(SequenceNo,TeamName,TeamLogoUrl,O,G,B,M,A,Y,AV,P,LeagueID) {
    await axios.POST('https://dailyathon.herokuapp.com/league-standings', {
        query:query
    })
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        });
}
*/

async function updateLeagueData(SequenceNo,TeamName,TeamLogoUrl,O,G,B,M,A,Y,AV,P,LeagueID) {
    await axios.put('https://dailyathon.herokuapp.com/league-standings', {
        query:sqlQuery
    })
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        });
}


function insertSql(SequenceNo,TeamName,TeamLogoUrl,O,G,M,A,Y,AV,P,LeagueID) {
    var sql = mysql.format("INSERT INTO tblBasketball SET  SequenceNo=" + mysql.escape(SequenceNo) + ", TeamName=" + mysql.escape(TeamName) +
    ", TeamLogoUrl=" + mysql.escape(TeamLogoUrl) +", O=" + mysql.escape(O) 
    +", G=" + mysql.escape(G) + ", M=" + mysql.escape(M) + ", A=" + mysql.escape(A)+", Y=" + mysql.escape(Y) + ", AV=" + mysql.escape(AV)
    +", P=" + mysql.escape(P) + ", LeagueID=" + mysql.escape(LeagueID));
    sqlQuery += sql+"; "
}

function updateSql(SequenceNo,TeamName,TeamLogoUrl,O,G,M,A,Y,AV,P,LeagueID) {
    var sql = mysql.format("UPDATE tblBasketball SET  SequenceNo=" + mysql.escape(SequenceNo) + ", TeamName=" + mysql.escape(TeamName) +
    ", TeamLogoUrl=" + mysql.escape(TeamLogoUrl) +", O=" + mysql.escape(O) 
    +", G=" + mysql.escape(G) + ", M=" + mysql.escape(M) + ", A=" + mysql.escape(A)+", Y=" + mysql.escape(Y) + ", AV=" + mysql.escape(AV)
    +", P=" + mysql.escape(P) + "WHERE LeagueID=" + mysql.escape(LeagueID));
    sqlQuery += sql+"; "
}

function LeagueData(data) {
    request(data.LeagueUrl, function (error, response, html) {
        if(data.SportID == 11)
        {
            if (! error && response.statusCode == 200 ) {
                const $ = cheerio.load(html);
                $ ('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status').each(function(i, element){
                    const SequenceNo = $ (this).find('span.p0c-competition-tables__rank').text();
                    const TeamName = $ (this).find('img.p0c-competition-tables__crest').attr('src');
                    const TeamLogoUrl = $ (this).find('span.p0c-competition-tables__team-name').first().text();
                    const O = $ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(2).text();
                    const G =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(3).text();
                    const M =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(4).text();
                    const A =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(5).text();
                    const Y =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(6).text();
                    const AV =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(7).text();
                    const P =$ (this).find('tr.p0c-competition-tables__row.p0c-competition-tables__row--rank-status>td').eq(8).text();
                    updateSql(SequenceNo,TeamLogoUrl,TeamName,O,G,M,A,Y,AV,P,data.LeagueID)
                });
                updateLeagueData();
            }
            else
            {
                console.log("League url error")
            }
        }
        else
        {
            console.log("Sport name is not basketball !")
        }

    });
}


const hours = (1000 * 60 * 60 * 4);
setInterval(getLeague, hours);
setTimeout(getLeague,1000)