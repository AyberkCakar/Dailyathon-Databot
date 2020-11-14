const axios = require('axios');
const mysql = require('mysql');

var data = '';

async function getStock() {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.collectapi.com/economy/hisseSenedi/',
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
        console.error(error);
    }
}

async function updateSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("UPDATE tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
        ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateStockData(query) {
    await axios.put('https://dailyathon.herokuapp.com/stock', {
        query: query
    })
        .then(function (response) {
            console.log('stock');
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

/*
function insertSql(lastprice, min, max, time, code, text) {
    var sql = mysql.format("INSERT INTO tblStock SET LastPrice=" + mysql.escape(lastprice) + ", Min=" + mysql.escape(min) +
    ", Max=" + mysql.escape(max) + ", Time=" + mysql.escape(time) + ", Text=" + mysql.escape(text) + ", Code=" + mysql.escape(code));
    data += sql+"; "
}


async function insertStockData(query) {
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

*/


const hours = (1000 * 60 * 60 * 24);
setInterval(getStock, hours);