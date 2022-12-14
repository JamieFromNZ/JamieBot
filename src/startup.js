var MongoClient = require("mongodb").MongoClient;
const { MembershipScreeningFieldType } = require("discord.js");
let Memer = require("random-jokes-api");

module.exports = async (client) => {
    // Storing all functions into client.functions so I can use them easily
    client.functions = await require('./functions/functions');
    
    // Storing all commands into the .commandFiles object of client
    client.commandFiles = await client.functions.getCommandFiles(client);
    console.log(`Stored commandfiles into client.commandFiles`);

    // Storing all event files into the .eventFiles object of client
    client.eventFiles = await client.functions.getEventFiles(client);
    console.log(`Stored eventfiles into client.eventFiles`);

    // Storing mydb into client.db so I can use it easily
    var mongoClient = await MongoClient.connect(process.env.MONGO_URI);
    client.db = await mongoClient.db("mydb");

    client.emotes = {
        warning: ':warning:',
        chart: ':chart_with_upwards_trend:',
        sparkles: ':sparkles:',
        shush: ':shushing_face:',
        check: ':white_check_mark:',
        info: ':information_source:',
        arrowUp: ':arrow_up:',
        star: ':star:',
    };

    // This is all the snipes cached
    client.snipes = new Map();

    // An API for jokes apparently
    client.memer = Memer;

    try {
        for (const file of client.eventFiles) {
            const event = await require(`../src/events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }

    } catch (e) { console.log(e) }
}