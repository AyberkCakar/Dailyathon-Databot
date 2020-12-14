const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')

var data = '';
var url = 'https://api.collectapi.com/economy/hisseSenedi';

async function getStock() {
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
            updateSql(element.lastpricestr, element.minstr, element.maxstr,element.time, element.code, element.text)
            }
        )
        await updateStockData(data);
    } catch (error) {
        log.createLog('Stock Bot',' ', 'getStock Error.',error.data.message);
    }
}

async function updateSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("UPDATE tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
        ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateStockData(query) {
    await axios.put('https://serve-dailyathon.ayberkcakar.xyz/stock', {
        query: query
    })
    .then(function (response) {
        log.createLog('Stock Bot',url, ' Stock information updated successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Stock Bot',url, ' Stock information updated failed.',error.data.message);
    });
}

/*
function insertSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("INSERT INTO tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
    ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + ", Code=" + mysql.escape(code));
    data += sql+"; "
}


async function insertStockData(query) {
    await axios.post('https://serve-dailyathon.ayberkcakar.xyz/stock', {
        query:query
    })
    .then(function (response) {
        log.createLog('Stock Bot',url, ' Stock information added successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Stock Bot',url, ' Stock information added failed.',error.data.message);
    })
}
*/


const hours = (1000 * 60 * 60 * 24);
setInterval(getStock, hours);