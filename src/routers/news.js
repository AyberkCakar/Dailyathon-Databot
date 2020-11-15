const axios = require('axios');
const mysql = require('mysql');
const log = require('../service/logService')
require('dotenv').config()

var sqlQuery= '';

async function getNews() {
    try {
        await businessNews();
        await entertainmentNews();
        await healthNews();
        await sienceNews();
        await sportsNews();
        await technologyNews();
        await economyNews();
    } catch (error) {
        log.createLog('News Bot',' ', 'getNews Error.',error.data.message);
    }
}

async function businessNews() {
    try {
        const path= 'http://newsapi.org/v2/top-headlines?country=tr&category=business&apiKey=' +process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,171)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'businessNews Error.',error.data.message);
    }
}

async function entertainmentNews() {
    try {
        const path='http://newsapi.org/v2/top-headlines?country=tr&category=entertainment&apiKey='+process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,181)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'entertainmentNews Error.',error.data.message);
    }
}

async function healthNews() {
    try {
        const path='http://newsapi.org/v2/top-headlines?country=tr&category=health&apiKey='+process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,191)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'healthNews Error.',error.data.message);
    }
}

async function sienceNews() {
    try {
        const path='http://newsapi.org/v2/top-headlines?country=tr&category=science&apiKey='+process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,201)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'sienceNews Error.',error.data.message);
    }
}

async function sportsNews() {
    try {
        const path='http://newsapi.org/v2/top-headlines?country=tr&category=sports&apiKey='+process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,1)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'sportsNews Error.',error.data.message);
    }
}

async function technologyNews() {
    try {
        const path='http://newsapi.org/v2/top-headlines?country=tr&category=technology&apiKey='+process.env.NEWAPI;
        let response = await axios.get(path)
        response.data.articles.forEach(element => {
            insertSql(element.title, element.description,element.urlToImage,element.content,element.publishedAt,4)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'technologyNews Error.',error.data.message);
    }
}

async function economyNews() {
    try {
        const path='https://api.collectapi.com/news/getNews?country=tr&tag=economy';
        let response = await axios.get(path,{
            headers: {
                "content-type": "application/json",
                "authorization": process.env.API2,
            }
        })
        response.data.result.forEach(element => {
            insertSql(element.name, element.description,element.image,element.description,Date.now(),3)
        })
        await insertNewsData(sqlQuery)
        sqlQuery= ' ';
    } catch (error) {
        log.createLog('News Bot',path, 'economyNews Error.',error.data.message);
    }

}


function insertSql(title, description,urlToImage,content,publishedAt,tagID) {
    var sql = mysql.format("INSERT INTO tblNews SET  NewsTitle=" + mysql.escape(title) + ", NewsDescription=" + mysql.escape(description) +
    ", NewsImage=" + mysql.escape(urlToImage) +", Content=" + mysql.escape(content) 
    +", date=" + mysql.escape(publishedAt) + ", TagID=" + mysql.escape(tagID));
    sqlQuery += sql+"; "
}

async function insertNewsData(query) {
    await axios.post('https://dailyathon.herokuapp.com/news', {
        query:query
    })
    .then(function (response) {
        log.createLog('News Bot',' ', ' News information added successfully.',response.data.message);
    })
    .catch(function (error) {
        log.createLog('News Bot',' ', ' News information added failed.',error.data.message);
    })
}

const hours = (1000 * 60 * 60 * 24);
setInterval(getNews, hours);