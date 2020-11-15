const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')

var data = '';
var url = 'https://api.collectapi.com/economy/cripto';
async function getCripto() {
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
            updateSql(element.currency, element.changeWeekstr, element.changeDaystr,element.pricestr, element.code, element.name)
            }
        )
        await updateCriptoData(data);
    } catch (error) {
        log.createLog('Cripto Bot',' ', 'getCripto Error.',error.data.message);
    }
}

async function updateSql(currency, changeWeek, changeDay, price, code, name) {
    var sql = mysql.format("UPDATE tblCripto SET Currency=" + mysql.escape(currency) + ", ChangeWeek=" + mysql.escape(changeWeek) +
        ", ChangeDay=" + mysql.escape(changeDay) + ", Price=" + mysql.escape(price) + ", Name=" + mysql.escape(name) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateCriptoData(query) {
    await axios.put('https://dailyathon.herokuapp.com/cripto', {
        query: query
    })
    .then(function (response) {
        log.createLog('Cripto Bot',url, ' Cripto information updated successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Cripto Bot',url, ' Cripto information updated failed.',error.data.message);
    });
}

/*
function insertSql(currency, changeWeek, changeDay, price, code, name) {
    var sql = mysql.format("INSERT INTO tblCripto SET Currency="+  mysql.escape(currency)+", ChangeWeek="+ mysql.escape(changeWeek)+
    ", ChangeDay="+ mysql.escape(changeDay)+", Price="+ mysql.escape(price)+", Code="+ mysql.escape(code)+", Name="+ mysql.escape(name));
    data += sql+"; "
}

async function insertCriptoData(query) {
    await axios.post('https://dailyathon.herokuapp.com/cripto', {
        query:query
    })
    .then(function (response) {
        log.createLog('Cripto Bot',url, ' Cripto information added successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('Cripto Bot',url, ' Cripto information added failed.',error.data.message);
    })
}
*/


const hours = (1000 * 60 * 60 * 24);
setInterval(getCripto, hours);