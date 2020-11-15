const axios = require('axios');



export async function createLog(botName,url,message,exception) {
    try {
        await axios.post('https://dailyathon.herokuapp.com/databotlog',{
            BotName:botName,
            Url:url,
            Message:message,
            Exception: exception,
            RegDate: Date.now()
        });

    
    } catch (error) {
        console.error(error);
    }
}

