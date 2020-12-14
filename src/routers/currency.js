const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')

var data = '';
var url = 'https://api.collectapi.com/economy/allCurrency';

async function getCurrency() {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                "content-type": "application/json",
                "authorization": process.env.API1,
            }
        });
        response.data.result.forEach(element => {
            updateSql(element.name, element.code, element.buyingstr,element.sellingstr, element.rate, element.datetime)
            }
        )
        await updateCurrencyData(data);
    } catch (error) {
        log.createLog('Currency Bot',' ', 'getCurrency Error.',error.data.message);
    }
}

async function updateSql(name, code, buying, selling, rate, datetime) {
    var sql = mysql.format("UPDATE tblCurrency SET Name=" + mysql.escape(name) + ", Buying=" + mysql.escape(buying) +
        ", Selling=" + mysql.escape(selling) + ", Rate=" + mysql.escape(rate) + ", Datetime=" + mysql.escape(datetime) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateCurrencyData(query) {
    await axios.put('https://serve-dailyathon.ayberkcakar.xyz/currency', {
        query: query
    })
    .then(function (response) {
        log.createLog('Currency Bot',url, ' Currency information updated successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Currency Bot',url, ' Currency information updated failed.',error.data.message);
    });
}

/*
function insertSql(name, code, buying, selling, rate, datetime) {
    var sql = mysql.format("INSERT INTO tblCurrency SET  Name=" + mysql.escape(name) + ", Buying=" + mysql.escape(buying) +
    ", Selling=" + mysql.escape(selling) + ", Rate=" + mysql.escape(rate) + ", Datetime=" + mysql.escape(datetime)+ ", Code=" + mysql.escape(code));
    data += sql+"; "
}


async function insertCurrencyData(query) {
    await axios.post('https://serve-dailyathon.ayberkcakar.xyz/currency', {
        query:query
    })
    .then(function (response) {
        log.createLog('Currency Bot',url, ' Currency information added successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Currency Bot',url, ' Currency information added failed.',error.data.message);
    })
}
*/


const hours = (1000 * 60 * 60 * 24);
setInterval(getCurrency, hours);