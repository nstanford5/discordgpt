const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, InteractionResponse, ThreadChannel, GuildTextThreadManager, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const { token } = require('./config.json');
const message = require('./events/message');
const {OPEN_SEA_API_KEY} = require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  // set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event  = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

function sleep(ms){
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
}

client.on('interactionCreate', async interaction => {
  if(!interaction.isButton()) return;
  /**
     * this is required to work around the 3
     * second response requirement from discord.js
     */
  await interaction.reply(`Please wait, I am processing your request...`);

  const { FetchNFTClient } = await import('@audius/fetch-nft');
  const openSeaConfig = {
    apiEndpoint: 'https://api.opensea.io/api/v2',
    apiKey: OPEN_SEA_API_KEY,
    assetLimit: 50,
    eventLimit: 300
  }
  
  const solanaConfig = {
    rpcEndpoint: 'https://api.mainnet-beta.solana.com'
  }

  const fetchClient = new FetchNFTClient({ openSeaConfig, solanaConfig });
  
  if(interaction.customId === 'fetch-sol-nfts'){
    /**
     * This structure collects any amount of NFTs for display and
     * formats them in a friendly way to display to the UI
     */
    const solCollects = await fetchClient.getSolanaCollectibles(['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY']);
    const [...Collectibles] = solCollects['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY'];
    const len = Collectibles.length;
    await interaction.followUp(`I found ${len} Collectibles in the users wallet. I will display them here for your convenience...`);
    
    let nums = [];
    for(let i = 0; i < len; i++){
      sleep(3000);
      nums[i] = Collectibles.pop(i);
      await interaction.followUp(`Name: ${nums[i].name}\n` +
            `Token ID: ${nums[i].tokenId}\n` +
            `Description: ${nums[i].description}\n`);
    }// end of for
  }

  // broken?, returns {}
  if(interaction.customId === 'fetch-eth-nfts'){
    const ethCollects = await fetchClient.getEthereumCollectibles(['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9']);
    const [...Collectibles] = ethCollects['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9'];
    
    const len = Collectibles.length;
    let nums = [];
    for(let i = 0; i < len; i++){
      nums[i] = Collectibles.pop(i);
      await interaction.followUp(`Name: ${nums[i].name}\n` +
            `Token ID: ${nums[i].tokenId}\n` +
            `Description: ${nums[i].description}\n`);
    }// end of for
  }
})

client.on('interactionCreate', async interaction => {
  if(!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;
  try{
    await command.execute(interaction);
  } catch (e) {
    console.error(e);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);