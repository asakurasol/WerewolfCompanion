//Flow
//1.Get number of players
//2.Get player names
//3.Select playable role cards
//4.Randomly distribute role card to players
//5.Start night/day cycle until winning criteria is met

//Todo

//implement function for back buttons

//validation for all inputs

	//step 2 - player names must not be undefined, and must not repeat
	//step 3 - Multiple validations
	//		 - Must select at least 1 werewolf or 1 vampire
	//		 - number of selection must equal to number of players
	//		 - If Luke is selected, Leia must be selected, and vice versa
	//step 5 - action selection - remove self selection for Bella, Batman
	//step 5 - add drop menu for no action

//write useful console.log functions for debugging
//add an additional screen for options, ie, can doctor overdose, can werewolf mafia convert, and if so, how many


//add kirby action
//add sue action
//change player role assignment to table instead of list
//modify the player role assignment in game log as it progresses
//set game over conditions and logic for selecting winner
//button for testing

//********Variables*******//

//create constructor
var Rolecard = function(name, nightOrder, nightMessage){
	this.name = name;
	this.nightOrder = nightOrder;
	this.nightMessage = nightMessage;
}

//set default values using prototype
Rolecard.prototype.playerName = '';
Rolecard.prototype.target = function(array){
								return createDropdown(this.name,this.nightMessage, array);		
							};
Rolecard.prototype.getTarget = function(){
									var dropdownID = "#dropdown"+this.name+ " option:selected";
									return $(dropdownID).text();
								},
Rolecard.prototype.action = function(){

							};
Rolecard.prototype.werewolf = false;
Rolecard.prototype.vampire = false;
Rolecard.prototype.bella = false;
Rolecard.prototype.doctored = false;
Rolecard.prototype.doctoredLast = false;
Rolecard.prototype.toBeRemoved = false;
Rolecard.prototype.toBeRevealed = false;
Rolecard.prototype.resetStatus = function(){
									this.bella = false;
									this.doctoredLast = false;
									if(this.doctored === true){
										this.doctoredLast  = true;
										this.doctored = false;
									}
								};
//logic for vampire/werewolf bites
Rolecard.prototype.bite = function(array, booleanFunc, addFunc, target){					
							//find location of target in array
								var index = searchTarget(target, array)								
								var obj = array[index];
							
							//check to see if the person is doctored or bella or is already vampire/werewolf
								if (obj.bella == true || obj.doctored == true || obj[this.name.toLowerCase()] == true){	
								gamelog(this.name+ ' tried to bite ' + obj.playerName + ' but was not able to');				
								}
							//convert or kill target
								else if(booleanFunc()){
									obj.toBeRemoved = true;
									gamelog(this.name+ ' killed ' + obj.playerName + '.');	
								}
								else{
									obj[this.name.toLowerCase()] = true;
									gamelog(this.name+ ' converted ' + obj.playerName + '.');	
									addFunc();
								};
							//check to see if target is bella
								if (obj.name == 'Bella'){
									var bellaIndex = searchTarget(obj.sleptWith, array);
									var bellaObj = array[bellaIndex];
									gamelog(this.name+ ' found ' + obj.playerName + ' in bed with ' + bellaObj.playerName+'.');	
									//make the player killable
									bellaObj.bella = false;						
									this.bite(array, booleanFunc, addFunc,bellaObj.playerName);
								}

							};
//logic for batman/sue/public
Rolecard.prototype.kill = function(array, booleanReveal){
								var target = this.getTarget();					
							//find location of target in array
								var index = searchTarget(target, array)							
								var obj = array[index];
							//check to see if the person is doctored or bella or is the player himself
								if (obj.bella == true || obj.doctored == true || obj.playerName == this.playerName){	
								gamelog(this.name+ ' tried to kill ' + obj.playerName + ' but was not able to');				
								}
							//kill target
								else{
									obj.toBeRemoved = true;
									gamelog(this.name + ' killed ' + obj.playerName + '.');	
									if(booleanReveal == true){obj.toBeRevealed = true;
									gamelog(this.name + ' revealed ' + obj.playerName + ' to be the ' + obj.name);	
									};
								};
							};

//logic for doctor with overdose
Rolecard.prototype.inject = function(array){
								var target = this.getTarget();					
							//find location of target in array
								var index = searchTarget(target, array)							
								var obj = array[index];
							//check to see if the person was doctored last night
								if (obj.doctoredLast == false){	
								gamelog(this.name+ ' doctored ' + obj.playerName);	
								obj.doctored = true;			
								}
							//if target was injected last night, overdose the target
								else{
									obj.toBeRemoved = true;
									gamelog(this.name + ' overdosed ' + obj.playerName + '.');		
								};
							};

//logic for Bella sleeping with people
Rolecard.prototype.sleep = function(array){
								var target = this.getTarget();					
							//find location of target in array
								var index = searchTarget(target, array)							
								var obj = array[index];
							//make sure Bella isn't sleeping with herself
								if(obj.playerName !== this.playerName){
										gamelog(this.name+ ' slept with ' + obj.playerName);	
										obj.bella = true;	
										this.sleptWith = obj.playerName;		
									}
							};

var mob = new Rolecard('Mob', 99, "Who would you like to lynch?");
mob.action = function(array){this.kill(array, false)};


var sharedWerewolf = new Rolecard('Werewolf', 5, "Who would you like to bite?");
sharedWerewolf.playerName = 'Werewolf';
sharedWerewolf.action = function(array){
										var target = this.getTarget();
										this.bite(array, isWolfConvFull, addWolfConv,target);
									};

var sharedVampire = new Rolecard('Vampire', 6, "Who would you like to bite?");
sharedWerewolf.playerName = 'Vampire';
sharedVampire.action = function(array){
										var target = this.getTarget();	
										this.bite(array, isVampConvFull, addVampConv,target);
									};

var doctorCard = new Rolecard('Doctor',2,'Who would you like to cure?')
doctorCard.action = function(array){this.inject(array)};

var bellaCard = new Rolecard('Bella',3,'Who would you like to sleep with?')
bellaCard.action = function(array){this.sleep(array)};

var detectiveCard = new Rolecard('Detective',4,'Who would you like to check?')

var werewolfCard = new Rolecard('Werewolf', 5, "Who would you like to bite?");
werewolfCard.werewolf = true;
werewolfCard.target = function(array){return ''};

var vampireCard = new Rolecard('Vampire', 6, "Who would you like to bite?");
vampireCard.vampire = true;
vampireCard.target = function(array){return ''};

var batmanCard = new Rolecard('Batman', 7, "Who would you like to kill?");
batmanCard.action = function(array){this.kill(array, true)};

//declare the role cards that do not have night actions, return nothing when prompted for night action

var bieberCard = new Rolecard('Bieber', 99, '');
bieberCard.target = function(array){return ''};

var sueCard = new Rolecard('Sue', 99, '');
sueCard.target = function(array){return ''};

var kirbyCard = new Rolecard('Kirby', 99, '');
kirbyCard.target = function(array){return ''};

var littlefingerCard = new Rolecard('Littlefinger', 99, '');
littlefingerCard.target = function(array){return '';};

var lukeCard = new Rolecard('Luke', 1, '');
lukeCard.target = function(array){return ''};

var leiaCard = new Rolecard('Leia', 1, '');
leiaCard.target = function(array){return ''};

var roleCards = [];

roleCards.push(werewolfCard, vampireCard, sueCard, bieberCard, lukeCard, leiaCard, kirbyCard, littlefingerCard, batmanCard, doctorCard, bellaCard, detectiveCard);


var numberOfPlayers = 0;
var activeRoles = [];
var sharedRoles = [];
var daytimeRoles = [mob];
var deactiveRoles = [];
var maxVampConversions = 2;
var vampConversions = 0;
var maxWolfConversions = 2;
var wolfConversions = 0;
var nightCount = 0;
var dayCount = 0;
var gameover = false;
var winner =[];


//*******Listeners*******//
//ask How many players

$("#askNumberPlayers .nextButtons").on('click', function(){

	//remove warning if failed validation in prior attempt
	$(".warning").remove();
	//get the number of players from text value
	numberOfPlayers = $("#numberOfP").val();

	if(validateNumberPlayers(numberOfPlayers)){
		//append text fields 
		$("#askPlayerNames form").prepend(fieldForNames(numberOfPlayers));

		$("#askNumberPlayers").addClass("hidden");
		$("#askPlayerNames").removeClass("hidden");

	//reset role lists

		roles = [];
		gamelog(numberOfPlayers + " players entered the room.");
	}
	else{
		$("#numberOfP").after(warning('Please enter an integer between 6 and 12.'));
		$("#numberOfP").focus();
	}
})

//Input name of players #askPlayerNames

$("#askPlayerNames .nextButtons").on('click', function(){
	$("#askPlayerNames").addClass("hidden");
	playerNames = getNames();
	$("#selectRoles").removeClass("hidden");
})

//listeners for adding/removing roles

$("#selectRoles").on('click', 'input', function(){
		
	if($(this).prop('checked')){
		roles.push(this.value);
	}
	else{
		roles.splice(roles.indexOf(this.value),1);
	};
	rolesRefresh(roles);
})

//select roles #selectRoles

$("#selectRoles .nextButtons").on('click', function(){
	$("#selectRoles").addClass("hidden");
	$("#assignRoles").removeClass("hidden");
	//randomly assign roles to players #assignRoles
	activeRoles = mapObjects(playerNames, randomArray(roles));
	refreshSharedArray(sharedRoles, activeRoles);
	//post assignment to page
	$("#assignRoles form").prepend(playerRoleList(activeRoles));
	//post assignment to page
	activeRoles = sortObjArray(activeRoles);
})

//Start the night


$("#assignRoles .nightButtons").on('click', function(){
	//post assignments to log
	gamelog("Roles are assigned as follows:")
	gamelog(playerRoleList(activeRoles));


	$("#assignRoles").addClass("hidden");
	$("#night").removeClass("hidden");
	$("#log").removeClass("hidden");
	nightTime();
	$("#night #actions").append(loopCreateDropdown(activeRoles,activeRoles));
	$("#night #actions").append(loopCreateDropdown(sharedRoles,activeRoles));
})

//create listener for detective
$("#actions").on('change',"#dropdownDetective",function(){
	$("#dropdownDetective").parent().children(".warning").remove();
	var obj = activeRoles[searchTarget(detectiveCard.getTarget(), activeRoles)];
	console.log(obj.werewolf + obj.vampire);
	if(obj.werewolf || obj.vampire){
		$("#dropdownDetective").parent().append(warning(obj.playerName + " is villain!!"));
		gamelog("The detective checked " + obj.playerName + " and found a villain!!");
	}
	else{
		$("#dropdownDetective").parent().append(warning(obj.playerName + " seems normal."));
		gamelog("The detective checked " + obj.playerName + " and didn't find anything.");	
	};
})


//Cycle through day and nights
$("#night .dayButtons").on('click', function(){
	//switch between night and day divs
	$("#night").addClass("hidden");
	$("#day").removeClass("hidden");
	//For each role with action, assign target and execute logic for their actions

	executeActions(activeRoles,activeRoles);
	executeActions(sharedRoles,activeRoles);
	resetActiveRoles(activeRoles);
	refreshSharedArray(sharedRoles, activeRoles);
	//turn on the light
	dayTime();
	//refresh the day actions with the latest active players
	$("#dayActions").children("div").remove();
	$("#dayActions").append(loopCreateDropdown(daytimeRoles,activeRoles));

})


$("#day .nightButtons").on('click', function(){

	executeActions(daytimeRoles,activeRoles);
	resetActiveRoles(activeRoles);
	refreshSharedArray(sharedRoles, activeRoles);

	//switch between night and day divs
	$("#day").addClass("hidden");
	$("#night").removeClass("hidden");
	resetActiveRoles(activeRoles);
	refreshSharedArray(sharedRoles, activeRoles);
	//turn off the light
	nightTime();
	//refresh the night actions with the latest active players
	$("#actions").children("div").remove();
	$("#actions").append(loopCreateDropdown(activeRoles,activeRoles));
	$("#actions").append(loopCreateDropdown(sharedRoles,activeRoles));
})



//*****Functions*******//
//function that updates the current list of roles

var markup = function(string, tag, id){
	if(!id){ id =''}
	else{id = ' id = "'+id+'"'}
	return '<'+tag+id+'>'+string+'</' + tag+'>';
}

var markupClass = function(string, tag, htmlClass){
	if(!htmlClass){ htmlClass =''}
	else{htmlClass = ' class = "'+htmlClass+'"'}
	return '<'+tag+htmlClass+'>'+string+'</' + tag+'>';
}

var gamelog = function(string){
	$("#log").append(markup(string, 'p'))
}

var gamelogAnnounce = function(string){
	$("#log").append(markupClass(string, 'p', 'announcements'))
}

var rolesRefresh = function(rolesArray){
	$("#currentRoles").remove();
	var results = '';
		var i = 0;
	forEach(rolesArray, function(element){

		if (i===0){ 
			results = element.toString();
			i++;
		}
		else {
			results = results + ' , ' + element.toString()
		}
	});

	results = markup("<p>You are currently playing with the following characters</p> " + results + "<br>", "div", "currentRoles");


	//remove the comma in front
	$("#selectRoles form").append(results);

}

var fieldForNames = function(num){
	var result = '';

	for(i=1; i<=num; i++){
		result = result + markup('Player '+ i + ': <input type="text" id="player' +i+ '">', 'div');
	};

	return result;
}

var getNames = function(){

	console.log("Get player names.")

	var playerNames = [];

	//Loop through number of players and store their names 

	for(i=1; i <= numberOfPlayers; i++){
		var id = '#player' + i;
		playerNames.push($(id).val());
	}

	return playerNames;
}


//map players to objects
var mapObjects = function(playerNames, roles){

	var activeRoles = [];

	for(var i=0;i<playerNames.length;i++){
			var obj = searchRole(roles[i], roleCards);
			obj.playerName = playerNames[i];
			activeRoles.push(obj);
	}

	return activeRoles;
}

//A function that takes in the role name and return the object with the matching role name

var searchRole = function(role, array){

	var result = -1;
	forEach(array, function(element){

		if(role == element.name){
			result = element;
			return;
		}
	});

	return result;
}

//Add shared roles after the playable roles are selected



//A function that takes in the player name, usually the target of player actions, and return the position

var searchTarget = function(target, array){

	for(var i = 0; i < array.length; i++){
		if(target === array[i].playerName){
			return i;
		}
	}
	return -1;
}

//A function that refreshes the public role array depending on the active roles array

var refreshSharedArray = function(sharedArray, activeArray){
	//clear input array
	console.log("resetting shared array" + sharedArray);
	sharedArray.splice(0, sharedArray.length);
	console.log(searchRole('Werewolf', activeArray));
	if(searchRole('Werewolf', activeArray)!==-1){
		console.log("Werewolf added to shared array");
		sharedArray.push(sharedWerewolf)
	};
	if(searchRole('Vampire', activeArray)!==-1){
		console.log("Vampire added to shared array");
		sharedArray.push(sharedVampire)
	};
		console.log(sharedArray);
}

//randomly assign roles to players #assignRoles
var randomArray = function(cardArray){
	console.log("randomizing the input array")
	var result = [];

	while(cardArray.length > 0){
		var len = cardArray.length;
		var arrayIndex = Math.floor(Math.random()*len);
		result.push(cardArray[arrayIndex]);
		cardArray.splice(arrayIndex,1);
	};

	return result;
}

//print out each elements of our 2 arrays in list form
var playerRoleList = function(array){
	var result = '';

	forEach(array, function(element){
		result = result + "<li>" + element.playerName + " : " + element.name + "</li>";
	});

	result = "<div><ul>"+result+"</ul></div>"

	return result;
}


//function that returns the index of the object with the minimum sort order
var findMinObj = function(array){
	var result = 0;
	var minOrder = 99;

	for (var i = 0; i<array.length;i++){
		if (array[i].nightOrder<=minOrder){
			result = i;
			minOrder = array[i].nightOrder;
		}
	}

	return result;
}

//sort the object array from least order to highest

var sortObjArray = function(array){

	var result = [];

	while(array.length > 0){
		var minIndex = findMinObj(array);
		result.push(array[minIndex]);
		array.splice(minIndex,1);
	}

	return result;

}

//creation a function that creates a drop down menu 
var createDropdown = function(name, message, array){
	var result = '';
		forEach(array, function(element){
			result = result + '<option value = "' + element.playerName + '">' + element.playerName + '</option>';
		});
	result = '<div><p>'+name + ' ' + message+'</p><select id = "dropdown'+name+'">' + result + "</select><br></div>";
	return result;

}

//create drop down for each role that's still active

var loopCreateDropdown = function(objArray, targetArray){
	console.log("create drop down for each role that's still active")
	var result = '';

	forEach(objArray, function(element){
		result = result + element.target(targetArray);
	});

	return "<div>" + result; + "</div>"

}

var nightTime = function(){
	console.log("switching to nighttime.")
	$("html").addClass("night");
	$("div").addClass("night");
	nightCount++;

	gamelog("<h5>------ NIGHT " + nightCount + ' ------</h5>');
}

var dayTime = function(){
	console.log('switching to day time.');
	$("html").removeClass("night");
	$("div").removeClass("night");
	dayCount++;
	gamelog("<h5>------- DAY " + dayCount + ' --------</h5>');
}

var addVampConv = function(){
	vampConversions++;
}

var addWolfConv = function(){
	wolfConversions++;
}


var isVampConvFull = function(){
	console.log("Checking if vampire conversions reached max")
	if(vampConversions < maxVampConversions){
		return false;
	}
	else{
		return true;
	}
}

var isWolfConvFull = function(){
	console.log("checking if werewolf conversions reached max");
	if(wolfConversions < maxWolfConversions){
		return false;
	}
	else{
		return true;
	}
}

var forEach = function(array, action){

	for (var i = 0; i< array.length; i++){
		action(array[i]);
	}
}

var isIn = function(findMatch, array){

	var result = false;
	forEach(array, function(element){
		if(findMatch == element){result = true; return;}
	});
	return result;
}

var executeActions = function(array, targetArray){
	console.log("Execute actions from each array to target array");
	forEach(array, function(element){
		element.action(targetArray);
	});
}


//Reset active Roles to their original state and remove all dead players.
var resetActiveRoles = function(array){
	console.log("Resetting active roles to their original state and removing all dead players.");
	for(var i = 0; i < array.length; i++){

		if(array[i].toBeRemoved == true){
			gamelogAnnounce(array[i].playerName +  " died.");
			deactiveRoles.push(array[i]);
			array.splice(i,1);
			i--;
		}
		else{
			array[i].resetStatus();
		}
	}
}


//******Put all validations here*********//

//validate the number of players
//current support 6-12 players

var warning = function(string){
	console.log(markupClass(string, 'p', 'warning'));
	return markupClass(string, 'p', 'warning');
}

var validateNumberPlayers = function(number){
	var playerNumberArray = [6,7,8,9,10,11,12]
	return isIn(number, playerNumberArray); 
}


//make sure playernames not null, returns an index of the first one with null inputs, otherwise returns true
var validatePlayerNames = function(array){
	var result = true;
	var tester;
	var i = 0;



}

//make sure playernames do not repeat, returns an array with index of all repeating names
var validatePlayerNames = function(array){

}