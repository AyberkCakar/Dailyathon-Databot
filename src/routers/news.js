const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config()

var sqlBusiness= '';

async function getNews() {
    try {

    } catch (error) {
        console.error(error);
    }
}

async function businessNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=business&apiKey='+process.env.API2;
    let response = await axios.get(path)
    response.data.articles.forEach(element => {
        var sql = mysql.format("INSERT INTO tblNews SET  NewsTitle=" + mysql.escape(element.title) + ", NewsDescription=" + mysql.escape(element.description) +
        ", NewsImage=" + mysql.escape(dist) + ", NewsCategoryID=" + mysql.escape(address));
        sqlBusiness += sql+"; "
    })
}

async function entertainmentNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=entertainment&apiKey='+process.env.API2;
    await axios.get(path)
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function healthNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=health&apiKey='+process.env.API2;
    await axios.get(path)
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function sienceNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=science&apiKey='+process.env.API2;
    await axios.get(path)
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function sportsNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=sports&apiKey='+process.env.API2;
    await axios.get(path)
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function technologyNewws() {
    const path='http://newsapi.org/v2/top-headlines?country=tr&category=technology&apiKey='+process.env.API2;
    await axios.get(path)
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function economyNews() {
    const path='https://api.collectapi.com/news/getNews?country=tr&tag=general';
    await axios.get(path,{headers: {
            "content-type": "application/json",
            "authorization": process.env.API1,
        }})
        .then(function (response) {
            console.log(response.status);
        })
        .catch(function (error) {
            console.log(error);
        })
}


const hours = (1000 * 60 * 60 * 24);
// setInterval(getNews, hours);
