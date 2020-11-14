const axios = require('axios');
const mysql = require('mysql');

var data = '';

async function getCurrency() {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.collectapi.com/economy/allCurrency/',
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
        console.error(error);
    }
}

async function updateSql(name, code, buying, selling, rate, datetime) {
    var sql = mysql.format("UPDATE tblCurrency SET Name=" + mysql.escape(name) + ", Buying=" + mysql.escape(buying) +
        ", Selling=" + mysql.escape(selling) + ", Rate=" + mysql.escape(rate) + ", Datetime=" + mysql.escape(datetime) + " WHERE Code=" + mysql.escape(code));
    data += sql + "; "
}

async function updateCurrencyData(query) {
    await axios.put('https://dailyathon.herokuapp.com/currency', {
        query: query
    })
        .then(function (response) {
            console.log('currency');
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

/*
function insertSql(name, code, buying, selling, rate, datetime) {
    var sql = mysql.format("INSERT INTO tblCurrency SET  Name=" + mysql.escape(name) + ", Buying=" + mysql.escape(buying) +
    ", Selling=" + mysql.escape(selling) + ", Rate=" + mysql.escape(rate) + ", Datetime=" + mysql.escape(datetime)+ ", Code=" + mysql.escape(code));
    data += sql+"; "
}


async function insertCurrencyData(query) {
    await axios.post('https://dailyathon.herokuapp.com/currency', {
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
setInterval(getCurrency, hours);