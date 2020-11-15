const axios = require('axios');
let now = new Date();

async function createLog(botName,url,message,exception) {
    try {
        await axios.post('https://dailyathon.herokuapp.com/databotlog',{
            BotName:botName,
            Url:url,
            Message:message,
            Exception: exception,
            RegDate: now
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports={createLog};