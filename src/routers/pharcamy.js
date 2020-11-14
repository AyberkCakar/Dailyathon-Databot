const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config()

var data = '';
var city=[];
city.push("izmir");
city.push("Istanbul");
city.push("Ankara");

async function getPharmacy() {
    try {
        await deletePharmacyData();
        city.forEach(async(value)=> {
            const response = await axios({
                method: 'get',
                url: "https://api.collectapi.com/health/dutyPharmacy?ilce=&il="+value,
                headers: {
                    "content-type": "application/json",
                    "authorization": process.env.API2,
                }
            });
            response.data.result.forEach(element => {
                insertSql(element.name, value, element.dist,element.address, element.phone, element.loc);
            }
            )
            insertPharmacyData(data)
            data=' ';
        })
    } catch (error) {
        console.error(error);
    }
}

function insertSql(name, city,dist,address,phone,loc) {
    var sql = mysql.format("INSERT INTO tblPharmacy SET  Name=" + mysql.escape(name) + ", City=" + mysql.escape(city) +
    ", Dist=" + mysql.escape(dist) + ", Address=" + mysql.escape(address) + ", Phone=" + mysql.escape(phone)+ ", Location=" + mysql.escape(loc));
    data += sql+"; "
}

async function insertPharmacyData(query) {
    await axios.post('https://dailyathon.herokuapp.com/pharmacy', {
        query:query
    })
        .then(function (response) {
            console.log('pharmacy');
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function deletePharmacyData() {
    await axios.delete('https://dailyathon.herokuapp.com/pharmacy')
        .then(function (response) {
            console.log('pharmacy-delete');
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}


const hours = (1000 * 60 * 60 * 24);
setInterval(getPharmacy, hours);