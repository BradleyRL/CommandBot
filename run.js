const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require("fs");
//var pg = require('pg');
//pg.defaults.ssl = true;

var sequelize = new Sequelize(process.env.DATABASE_URL, {
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

//var client = new pg.Client(process.env.DATABASE_URL);

//client.connect(function (err) {
  //if (err) throw err;
  //console.log('Connected to postgres!...');
//});
  


	

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
	var CE = false;
	/*client.query('SELECT * FROM commands where command=$1;',[com],function(err,result)	{
		if (err) throw err;
		console.log(result.row[0]);
	});*/
	
	fs.readFile('./commands/commands.txt','utf8',function(err,f){
		var findCommands = f.toString().split(";");
		for(i = 0; i < findCommands.length; i++)
		{
			if(com == findCommands[i])
			{
				CE = true;
			}
		}
		if(CE == true)
		{
			createCommand(desc,true,com);
		} else if (CE == false)
		{
			createCommand(desc,false,com);
		}
	});
	
}

// Appends and/or creates the text files.
function createCommand(desc,b,com)
{
	/*
	client
		.query('INSERT INTO commands VALUES ($1,$2);',[com,desc],function(err,result)
		{
		console.log('Inserted');
	});*/
	var fileName = "./commands/" + com + ".txt";
	if(b == true)
	{
		fs.writeFile(fileName,desc,function(err){
		if(err) {
			return console.error(err);
		}
		});
	} else if (b == false){
		fs.appendFile('./commands/commands.txt',com+';',(err) =>
		{
		if(err) throw err;
		});
		
		fs.writeFile(fileName,desc,function(err){
		if(err) {
			return console.error(err);
		}
		});
	}
	return;
}

bot.login(token);
