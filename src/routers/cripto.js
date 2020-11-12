const https = require('https');
const axios = require('axios');
const mysql = require('mysql');

var data = '';

async function getCripto() {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.collectapi.com/economy/cripto',
            headers: {
                "content-type": "application/json",
                "authorization": "apikey 1nFVw18sbYa2ozyIfYAOQ6:2MMEuUnUb9saWehND143j0",
            }
        });
        response.data.result.forEach(element => {
            updateSql(element.currency, element.changeWeekstr, element.changeDaystr,element.pricestr, element.code, element.name)
            }
        )
        await updateCriptoData(data);
    } catch (error) {
        console.error(error);
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
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
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
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}
*/


const hours = (1000 * 60 * 60 * 24);
// setInterval(intervalFunc, hours);
setTimeout(getCripto, 1000);