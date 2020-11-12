const axios = require('axios');
const mysql = require('mysql');

var data = '';

async function getCripto() {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.collectapi.com/economy/hisseSenedi/',
            headers: {
                "content-type": "application/json",
                "authorization": "apikey 1nFVw18sbYa2ozyIfYAOQ6:2MMEuUnUb9saWehND143j0",
            }
        });
        response.data.result.forEach(element => {
            insertSql(element.lastpricestr, element.minstr, element.maxstr,element.time, element.code, element.text)
            }
        )
        await insertCriptoData(data);
    } catch (error) {
        console.error(error);
    }
}

async function updateSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("UPDATE tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
        ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateCriptoData(query) {
    await axios.put('https://dailyathon.herokuapp.com/stock', {
        query: query
    })
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}


function insertSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("INSERT INTO tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
    ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + ", Code=" + mysql.escape(code));
    data += sql+"; "
}


async function insertCriptoData(query) {
    await axios.post('https://dailyathon.herokuapp.com/stock', {
        query:query
    })
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}



const hours = (1000 * 60 * 60 * 24);
// setInterval(intervalFunc, hours);
setTimeout(getCripto, 1000);