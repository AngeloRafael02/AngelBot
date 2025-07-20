import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes, Client, GatewayIntentBits,Partials, Collection, PresenceUpdateStatus, Events, Interaction, CacheType, ActivityType, Channel, TextChannel, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { schedule } from 'node-cron';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { ClientWithCommands, Command } from './interfaces.js'
import { runDailyTasks } from './utils/runDailyTask.js';
import { getCommandsASObject } from './utils/getCommands.js';

const __filename:string = fileURLToPath(import.meta.url);
const __dirname:string = dirname(__filename);

const deployCommands = async ():Promise<void> => {
    try {
        let commands:Object[]=[]
        const commandsPath:string = join(__dirname, 'commands');
        commands = await getCommandsASObject(commandsPath);
        const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);
        console.log(`Started refreshing application slash commands globally.`);
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID ?? ''),
            { body: commands },             
        );

        console.log('Successfully reloaded all commands!');
    } catch (error) {
        console.error('Error deploying commands:', error)
    }
}



const client =  new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials:[
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ]
}) as ClientWithCommands ;
const commands: any[] = [];

function readCommandsRecursive(dir: string) {
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
            readCommandsRecursive(fullPath); // Recurse into subdirectories
        } else if (file.isFile() && file.name.endsWith('.ts')) {
            let module:any = import(pathToFileURL(fullPath).toString());
            const command = module.default;
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                console.warn(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}


client.commands = new Collection<string,Command>();
const commandsPath = join(__dirname, 'commands');

(async () => {
    const getCommandsAsCollections = async (directory:string)=>{
        const files = readdirSync(directory, { withFileTypes: true });
        for (const file of files) {
            const fullPath = join(directory, file.name);
            if (file.isDirectory()) {
                getCommandsAsCollections(fullPath);
            } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
                const module = await import(pathToFileURL(fullPath ).toString());
                const command = await module.default;
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(JSON.stringify(command))
                } else {
                    console.warn(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
    await getCommandsAsCollections(commandsPath);
})()

client.once(Events.ClientReady, async ()=>{
    console.log(`Ready, Logged in as ${client.user?.tag}`);
    await deployCommands();
    console.log(`Commands Deployed Globally`);
    const statusType = process.env.BOT_STATUS || 'online';
    const activityType = process.env.ACTIVITY_TYPE || 'PLAYING';
    const activityName = process.env.ACTIVITY_NAME || 'discord';

    client.user?.setPresence({
        status:PresenceUpdateStatus.Online, //Make it more dynamic in the future via StatusMap
        activities:[{
            name:'discord',
            type:ActivityType.Playing
        }]
    });
    console.log(`Bot Status Set To ${statusType}`);
    console.log(`Activity Set To ${activityType} ${activityName}`);

    schedule('49 9 * * *', async () => {
        await runDailyTasks(client, 'Scheduled Cron Job');
    }, {
        timezone: "Asia/Manila" // Set the timezone specifically for Balete, Calabarzon, Philippines
    });
});

client.on(Events.InteractionCreate, async (interaction:Interaction<CacheType>)=>{
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command){ 
        console.error(`No Command matching '${interaction.commandName}' was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({
                content:`There was an Error while executing this command`,
                ephemeral:true
            });
        } else {
            await interaction.reply({
                content:`There was an Error while executing this command`,
                ephemeral:true
            });
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('error', error => {
    console.error('A client error occurred:', error);
});

client.on('warn', info => {
    console.warn('A client warning occurred:', info);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});