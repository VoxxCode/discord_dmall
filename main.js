require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
const messageTxt = "";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('ready', async () => {
    console.log(`Connecter en tant que ${client.user.tag}`);

    const server = client.guilds.cache.get(process.env.GUILDID);
    let messageNumber = 0;

    if (server) {
        try {
            const members = await server.members.fetch();
            for (const member of members) {
                if (!member[1].user.bot) {
                    messageNumber += 1;
                    try {
                        await member[1].send(messageTxt);
                        console.log('Message envoyé à ' + member[1].user.tag + ". " + messageNumber + " messages envoyés.");
                    } catch (sendError) {
                        if (sendError.code === 50007) {
                            console.error(`Impossible d'envoyer un message à ${member[1].user.tag} : Vous avez désactivé les messages privés de la part des serveurs sur Discord.`);
                        } else {
                            console.error(`Erreur lors de l'envoi d'un message à ${member[1].user.tag} :`, sendError);
                        }
                    }
                    await sleep(200);
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des messages :', error);
        }
    } else {
        console.error('Serveur non trouvé !');
    }
});

client.login(process.env.TOKEN);