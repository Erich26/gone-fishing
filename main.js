const chalk = require('chalk');
const prompt = require('prompt-sync')({ sigint:true });


//initial game statement and border
console.log('');
console.log(chalk.red("We're going fishing! Maximize the value of your fish during the six hours allotted. You have a 10lb weight limit, get at 'em."));
console.log('');
console.log('==========================================================');
console.log('');

//saved game info through an array of fish caught 
//and an object holding the weight and value of the fish
let caughtFish = []
let fishing = {
    weight : 0,
    value : 0,
    treasure : 0,
    fish : caughtFish
}


//set the conditions of the game

let timesUp = '';
let min = 15;
let max = 90;
let chumWater = false;
let time = 0;


//functions to add functionality to the game

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function addFish(weight, fish, price) {
    caughtFish.push({ name : fish,
               weight : weight,
               value : price.toFixed(2)});
               fishing.value += Number(price);
               fishing.weight += Number(weight);
}

function sizeChecker(weight) {
    if(weight < 1) {
        return 'Tiny';
    }if( 1 < weight && weight < 2) {
        return 'Small';
    }if ( 2 <= weight && weight < 3) {
        return 'Medium';
    }if ( 3 <= weight && weight < 4) {
        return 'Large';
    }if ( weight >= 4) {
        return 'Gargantuan';
    }

}

function checkTime(time) {
    let hour = 6;
    let minutes = 0;
    while(time >= 60) {
        time -= 60;
        hour += 1;
    }
    minutes = time;
    let formattedHr = ('0' + hour).slice(-2);
    let formattedMin = ('0' + minutes).slice(-2);
    return `${formattedHr}:${formattedMin}am`;
}

function selectionValidator(input, a, b){
    if(input === a) {
        return 'add';
    }else if(input === b) {
        return 'deny';
    }else {
        console.log('Select a valid option');
        i = prompt('>');
        return selectionValidator(i, a, b);
    }

}

function weightChecker(w1, w2) {
    let weight1 = fishing.weight - w1;
    let weight2 = weight1 + w2;
    if(weight2 > 10) {
        return false;
    }else {
        return true;
    }

}
//validOption
function isValid(w1, w2) {
    let counter = 0;
    for(let fish of fishing.fishes) {
        let temp = fishing.weight - fish.weight;
        if(temp <= 10) {
            counter++;
        }
    }
    if(counter > 0) {
        return true;
    }else {
        return false;
    }

}

//calculating time it takes to catch fish

while(time < 360) {

    time += (Math.ceil(randomNumber(min,max)));

    if(time > 360) {
        timesUp = "You're done."
        break
    }
    //adding in stretch goal of chumming water to speed up fish time
    if(chumWater === false) {
        console.log('You can chum the water to catch fish faster. [yes] or [no]');
        const chum = prompt('>').toLowerCase();
        const validate = selectionValidator(chum, 'yes', 'no');
        if(validate === 'keep') {
            min = 10;
            max = 60;
            time += 30;
            chumWater = true;
            console.log('');
            console.log('You chummed the water.');
            console.log('');
        } if(validate === 'return') {
            console.log('');
            console.log('You did not chum the water.');
            console.log('');
        }
    }

    //information on the catch
    console.log(`The time is ${chalk.redBright(checkTime(time))}. You have caught:`);
    console.log(chalk.white(` ${fishing.fish.length} fish(s), `), chalk.blue(`${fishing.weight.toFixed(2)} lbs,`), chalk.green(`$${fishing.value.toFixed(2)}`))
    console.log('');

    //check weight
    if(fishing.weight > 10) {
        break;
    }
    // catching fish
    const fish = [{name:'Salmon', price : 9},
                  {name:'Catfish', price : 2},
                  {name:'Trout', price : 5},
                  {name:'Piranha', price : 4},
                  {name:'Bass', price : 3.5},
                  {name:'Eel', price : 6.5},
                  {name:'Bluegill', price : 15},
                  {name:'Yellow Perch', price : 2.5},
                  {name:'Golden Doubloon!', price : 1000},
                  {name:'Valueless Boot', price : 0}];

    let weight = Math.round(randomNumber(0,5 * 100) / 100);
    let fishIndex = Math.ceil(randomNumber(0.1, fish.length - 1));
    let result = `${(fish[fishIndex].name)}`;
    let fishValue = fish[fishIndex].price;
    let fishCaught = `${sizeChecker(weight)} ${result}`;
    
    if(fishValue === 0) {
        console.log(`You managed to reel in a ${chalk.red(result)} keep fishing.`);
        console.log('Please enter [c] to continue fishing');
        const confirm = prompt('>').toLowerCase();
        selectionValidator(confirm, 'c', 'c');
        continue;
    }
    else if(result === 'Golden Doubloon') {
        console.log(chalk.yellowBright(`Well hot dang, you caught yerself a ${chalk.whiteBright(result)} valued at`, chalk.greenBright('$1000'), '.'));
        console.log('[k]eep or [t]hrow away?');
        const confirm = prompt('>').toLowerCase();
        const valid = selectionValidator(confirm, 'k', 't');
        if(valid === 'add') {
            console.log('You pocketed the gold doubloon.');
            fishing.value += 1000;
            fishing.treasure += 1;
        } else if(valid === 'deny') {
            console.log('You tossed the gold doubloon back into the water.');
        }

    } else {
        let price = (Math.round((weight * fishValue) * 100) / 100);

        console.log('You have caught a', fishCaught, 'weighing', weight,'lbs valued at', price.toFixed(2));

        console.log('[c]atch or [r]elease ?');

        let input = prompt('>').toLowerCase();
        console.log('');

        let totalWeight = fishing.weight + weight;

        if(totalWeight > 10) {
            console.log('This fish would put you over 10lbs so you have to release it.');

        } else {
            const valid = selectionValidator(input, 'c', 'r');
            if(valid === 'add') {
                console.log('You chose to keep the fish.');
                addFish(weight, fishCaught, price);
            } if(valid === 'deny') {
                console.log('You chose to release the fish.');
            }
        }
        console.log('');
        console.log('==========================================================');
        console.log('');


    }
}

    console.log('The time is now', chalk.grey('12:00pm'), 'Time is up.');
    if(timesUp.length > 0) {
        console.log(timesUp)
    }
    console.log('')
    console.log(`You caught ${fishing.fish.length} fish:`);
    for(const fishes of fishing.fish) {
        console.log(`${chalk.blueBright(fishes.name)},`, chalk.red(`${fishes.weight} lbs,`), chalk.greenBright(`$${fishes.value}`));

    }
    console.log('');
    if(fishing.treasure > 0) {
        console.log(`You also found ${fishing.treasure}.`, `$${fishing.treasure * 1000}`);
        console.log('');
    }
    cons
