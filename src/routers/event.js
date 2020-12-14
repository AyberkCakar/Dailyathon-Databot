const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')

var data = '';
var url = 'https://backend.etkinlik.io/api/v2/events';
async function getEvent() {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                "content-type": "application/json",
                "X-Etkinlik-Token": process.env.EIO,
            }
        });

        response.data.items.forEach(element => {
            var start = element.start.replace(/T/, ' ').split(" ");
            var end = element.end.replace(/T/, ' ').split(" ");
            if(element.venue !=null)
            {
                insertSql(element.name, start[0],end[0], element.is_free, element.poster_url, element.ticket_url, 
                    element.venue.city.name, element.venue.district.name,element.venue.name,element.format.name)
            }
            else{
                insertSql(element.name,start[0],end[0]
                , element.is_free, element.poster_url, element.ticket_url, null, null,null,element.format.name)
            }
        })
        await insertEvent(data);
    } catch (error) {
        console.log(error)
        log.createLog('Event Bot',' ', 'getEvent Error.',error.data.message);
    }
}
 


function insertSql(name,start,end,isFree,posterUrl,ticketUrl,city,district,venue,format) {
    var sql = mysql.format("INSERT INTO tblEntertainment SET EntertainmentName="+  mysql.escape(name)+
    ", EntertainmentStartDate="+ mysql.escape(start)+", EntertainmentDueDate="+ mysql.escape(end)+", EntertainmentisFree="+ mysql.escape(isFree)+
     ", EntertainmentPosterUrl="+ mysql.escape(posterUrl)+ ", EntertainmentTicketUrl="+ mysql.escape(ticketUrl)+ ", EntertainmentCity="+ mysql.escape(city)+
      ", EntertainmentDistrict="+ mysql.escape(district)+ ", EntertainmentVenue="+ mysql.escape(venue)+
       ", TagID = (Select TagID From tblTag Where TagName ="+ mysql.escape(format)+")");
    data += sql+"; "
}

async function insertEvent(query) {
    await axios.post('https://serve-dailyathon.ayberkcakar.xyz/entertainment', {
        query:query
    })
    .then(function (response) {
        console.log(response);
        log.createLog('Event Bot',url, ' Event information added successfully.',response.data.message);
    })
    .catch(function (error) {
        console.log(error);

        log.createLog('Event Bot',url, ' Event information added failed.',error.response.data.message);
    })
}



const hours = (1000 * 60 * 60 * 24);
setInterval(getEvent, hours);