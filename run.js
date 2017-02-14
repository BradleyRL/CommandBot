const Discord = require('discord.js');
const bot = new Discord.Client();
var Sequelize = require("sequelize")


var sequelize = new Sequelize(process.env.DATABASE_URL, {
	timestamps: false,
	dialect: 'postgres',
	dialectOptions: {
		ssl: true
	}	
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


var Commands = sequelize.define('commands', {
	command:  {
		type: Sequelize.STRING,
		primaryKey:true
	},
    description: Sequelize.STRING
},
{
	timestamps: false,
	paranoid: false,
	freezeTableName: true
})

var Info = sequelize.define('info', {
	code:  {
		type: Sequelize.STRING,
		primaryKey:true
	},
    name: Sequelize.STRING,
	link: Sequelize.STRING
},
{
	timestamps: false,
	paranoid: false,
	freezeTableName: true
})

// ADD YOUR BOT'S TOKEN HERE
const token = "Mjc2NDA4OTU5NDI1MDUyNjc0.C3OxyA.SqHSMYSgbIPp9YhEZ62NAquOhjI";

bot.on('ready', () => {
});

bot.on('message', message => {
	
	var checkMessage = message.content.split(" ");
	//var who = message.user.
	if (checkMessage[0] == "!createcommand")
	{
		var commandText = message.content.split("|",2);
		var commandName = message.content.split(" ");
		checkExistingCommand(commandText,commandName, message);
		
	} else if (checkMessage[0] == "!addinfo")
		{
			var commandText = message.content.split("|",3);
			var commandName = message.content.split(" ");
			checkExistingInfo(commandText,commandName, message);
		} 
		else if (checkMessage[0] == "!info") 
			{
				var infoText = message.content.split(" ");
				console.log(infoText);
				console.log ("size: "+infoText.length)
				if 	(infoText.length  == 1) {
					message.reply("Please check your messages");
					sendInfoList(message)
				} else {
					console.log(infoText[0].trim().toUpperCase());
					console.log(infoText[1].trim().toUpperCase());
					var codeId = infoText[1].trim().toUpperCase();
					sendInfo(message,codeId)
				}
			}
			else 
			{
				var commandName = message.content.split(" ");
				if(commandName[1].charAt(0) == "!") {
					
					console.log(commandName);
					var codeId = infoText[0].trim().toUpperCase().replace("!","");
					sendCommand(message,codeId)
				}
			}
			
});

function sendCommand(message,codeId)
{
	if (codeId == "help") {
		sendCommadsList(message)
	}
	else {
		Command.findOne({ where: {command: codeId} }).then(function(command) {

		if (command != null) {
			message.channel.sendMessage(command.description)
		} 
	})
		
	}
}


function sendCommadsList(message)
{
	message.author.sendMessage("This is the list of commands you can use :");	
	Command.findAll({
			attributes : ['command']
	})
		.then (function(command) {
					for (i=0; i< command.length; i++) {
					message.author.sendMessage(command[i].command);	
					}
		})
}

function sendInfo(message,codeId)
{
	Info.findOne({ where: {code: codeId} }).then(function(champ) {
		//console.log(champ.name);
		//console.log(champ.link);
		if (champ != null) {
			message.channel.sendMessage(champ.link)
		} else {
			message.channel.sendMessage("Sorry, I dont have info for that champ..")
		}
	})
};

function sendInfoList(message)
{
	message.author.sendMessage("This is the list of Champs I currently have info for :");	
	Info.findAll({
			attributes : ['code','name']
	})
		.then (function(info) {
					for (i=0; i< info.length; i++) {
					message.author.sendMessage(info[i].code +" --> "+ info[i].name);	
					}
		})
};

function checkExistingCommand(commandText,commandName,message)
{
	var com = commandName[1].toLowerCase();
	var desc = commandText[1].trim();
			
	Commands.findAll({
			where: {			
				command: com
			},
			attributes : ['command']
	})
		.then (function(commands) {
			
			if (commands.length > 0) {
						console.log('Hay registros, se hace update');
						Commands.update (
						{ description : desc },
						{ where: { command: com }} )
						message.channel.sendMessage("Command !" + com + " has been updated");
			} else {
				console.log('No Hay registros se hace insert');
				Commands.create (
				{
					command: com,
					description : desc
				}
				)
				console.log('Se inserto');
				message.channel.sendMessage("Command !" + com + " has been created");
					
			
			}
		})
};

function checkExistingInfo(commandText,commandName,message)
{
	var com = commandName[1].toUpperCase();
	var desc = commandText[1].trim();
	var mylink = commandText[2].trim();
	console.log(com);
	console.log(desc);
	console.log(mylink);	
	Info.findAll({
			where: {			
				code: com
			},
			attributes : ['code']
	})
		.then (function(info) {
			
			if (info.length > 0) {
						console.log('Hay registros, se hace update');
						Info.update (
						{ name : desc,
						  link : mylink	
						},
						{ where: { code: com }} )
						message.channel.sendMessage("info for " + com + " has been updated");
			} else {
				console.log('No Hay registros se hace insert');
				Info.create (
				{
					code: com,
					name : desc,
					link : mylink
				}
				)
				console.log('Se inserto');
				message.channel.sendMessage("info for " + com + " has been created");
							
			}
		})
};


bot.login(token);
