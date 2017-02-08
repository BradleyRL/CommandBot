const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require("fs");
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
	// Makes sure the first word is ~createcommand
	var checkMessage = message.content.split(" ");
	if(checkMessage[0] == "!createcommand")
	{
		// commandText gets grabbed by splitting the string with |
		// commandName gets grabbed by splitting the string with spaces
		// command Name must have '~' in it just so you can't use any word you
		// want
		var commandText = message.content.split("|",2);
		var commandName = message.content.split(" ");
		//if(commandName[1].charAt(0) == "!")
			//{
				checkExistingCommand(commandText,commandName);
				message.channel.sendMessage("Command " + commandName[1] + " has been created");
			//} else {
			//	message.channel.sendMessage("Command must contain '!'");
			//}
	}

	/*
	 * Checks the commands.txt file to see if anyone posted the command.
	 * commands.txt is split with semi-colons. For loop to check every single
	 * command. If there is a match, then it opens up the txt file associate
	 * with that command. If there are multiple pictures then the user should
	 * type $random{} and then type in all the pictures in the brackets
	 * separated by semi-colons. If there is no $random{} then it just sends the
	 * message.
	 */
	fs.readFile('./commands/commands.txt','utf8',function(err,f){
		var com = f.toString().split(";");
		for(i = 0; i < com.length; i++)
		{
			if(message.content == com[i])
			{
				if(com[i] == "~commands")
					{
						message.channel.sendMessage(com);
						break;
					}
				if(com[i] == "~help")
					{
						/*client
							.query('SELECT table_schema,table_name FROM information_schema.tables;')
							.on('row', function(row) {
							console.log(JSON.stringify(row));
						});*/
						message.channel.sendMessage("How to create commands:\n~createcommand ~NameOfCommand | Type whatever you want here");
						break;
					}
				var command = "./commands/" + com[i] + ".txt";
				fs.readFile(command,'utf8', function(err,f){
				try{
					var com2 = f.toString().split(";");
					var num = Math.random() * ((com2.length - 1) - 0) + 0;
					message.channel.sendMessage(com2[Math.floor(num)]);
				}
				catch(err) {
					console.error("",err);
				}
				});
			}
		}
	});
  
});

function checkExistingCommand(commandText,commandName)
{
	var com = commandName[1];
	var desc = commandText[1];
			
	Commands.findAll({
			where: {			
				command: com
			},
			attributes : ['command']
	})
		.then (function(commands) {
			//commands.forEach(log);
			if (commands.length > 0) {
						console.log('Hay registros, se hace update');
						Commands.update (
						{ description : desc },
						{ where: { command: com }} )
			} else {
				console.log('No Hay registros se hace insert');
				Commands.create (
				{
					command: com,
					description : desc
				}
				)
				.complete(function(err, commands) {
					if (err) {
						console.log(err);
					} else {
						console.log('Se inserto');
					}
				})
			}
		})
};


bot.login(token);
