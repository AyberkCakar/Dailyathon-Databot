const  request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

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
    await axios.post('https://dailyathon.herokuapp.com/league-standings', {
        SequenceNo: SequenceNo,
        TeamName: TeamName,
        TeamLogoUrl: TeamLogoUrl,
        O: O,
        G: G,
        B: B,
        M: M,
        A: A,
        Y: Y,
        AV: AV,
        P: P,
        LeagueID: LeagueID,
        LeagueTableName: 'tblFootball'
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
            SequenceNo: SequenceNo,
            TeamName: TeamName,
            TeamLogoUrl: TeamLogoUrl,
            O: O,
            G: G,
            B: B,
            M: M,
            A: A,
            Y: Y,
            AV: AV,
            P: P,
            LeagueID: LeagueID,
            LeagueTableName: 'tblFootball'
    })
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        });
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
                    updateLeagueData(SequenceNo,TeamLogoUrl,TeamName,O,G,B,M,A,Y,AV,P,data.LeagueID)
                });
            }
            else
            {
                console.log("League url error")
            }
        }
        else
        {
            console.log("Sport name is not football !")
        }

    });
}


setInterval(getLeague,1000);