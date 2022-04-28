const DiscordClient = require("./BoilerPlate/Discord");
const Deploy_GameCommands = require("./GameCommands/Commands")
const keepServerAlive = require("./BoilerPlate/Server");

var games = {};

DiscordClient.login(process.env["DISCORDBOTLOGIN"])
Deploy_GameCommands(DiscordClient)
keepServerAlive()






