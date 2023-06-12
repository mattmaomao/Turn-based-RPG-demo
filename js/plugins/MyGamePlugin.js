//global CONSTANT

const UP = 8;
const DOWN = 2;
const LEFT = 4;
const RIGHT = 6;

//-----------------------------------------------------------
//Entity super class

class Entity {
    constructor(arg) {
        this.initialize(arg);
        this.thisInitialize(arg);
    }

    //init value of entity
    initialize(arg) {
        this._character = arg.character;
        this._type      = '';
        this._id        = this._character._eventId || -1;
        this._name      = this._id == -1 ? arg.name : $dataMap.events[this._id].name;
        this._position  = [arg.x, arg.y];
        this._x = this._position[0];
        this._y = this._position[1];
        this._direction = this._character._direction;
        this._atkEvent  = $gameMap._events[CommonFunction.findEvent('entity atk')];
        this._atkPos    = null; this.getAttackPosition();

        //set in each entity type class
        this._hp        = 0;
        this._atk       = 0;
        this._def       = 0;
        this._atkId     = 1;
        this._alive     = true;

        //define move pattern
        this._moveList  = [];
        this._moveCounter = 0;
    }

    //develop in each type of entity
    thisInitialize(arg) {}

    //BUG, cant call by Bat class
    // setValue(type, value) {
    //     switch(type){
    //         case 'hp':
    //             this._hp = value; break;
    //         case 'atk':
    //             this._atk = value; break;
    //         case 'def':
    //             this._def = value; break;
    //         case 'position':
    //             this._position = value; break;
    //         case ' direction':
    //             this._direction = value; break;
    //         default: 
    //             break;
    //     }
    // }`

    //attack action
    attack() {

        this.getAttackPosition();
        this.attackAnimation(this._atkId);

        //check other entity collide with atk pos
        // console.log('atk at:', this._atkPos);
        if (this._type == 'Player') {
            for (var i = 1; i < entityList.length; i++) {
                // console.log('target at:', entityList[i]._position);
                if (entityList[i]._position[0] == this._atkPos[0] && entityList[i]._position[1] == this._atkPos[1]) {
                    entityList[i]._hp -= this._atk;
                    break;
                }
            }
        }
        else {
            // console.log('target at:', player._position);
            if (player._position[0] == this._atkPos[0] && player._position[1] == this._atkPos[1]) {
                player._hp -= this._atk;
            }
        }
    }
    
    //get attack position
    getAttackPosition() {

        this._position  = [this._character._x, this._character._y];
        // this._position  = [this._x, this._y];
        this._direction = this._character._direction;
        this._atkPos    = [...this._position];

        switch(this._direction) {
            case UP:
                this._atkPos[1]--;
                break;
            case DOWN:
                this._atkPos[1]++;
                break;
            case LEFT:
                this._atkPos[0]--;
                break;
            case RIGHT:
                this._atkPos[0]++;
                break;
        }
    }

    //default basic attack
    attackAnimation(animeId) {
        //set animation posotion
        this._atkEvent._realY = this._atkEvent._y = this._atkPos[1];
        this._atkEvent._realX = this._atkEvent._x = this._atkPos[0];
        
        //call animation
        $gameMap._interpreter._character = this._atkEvent;
        $gameMap._interpreter._character.requestAnimation(animeId);
        $gameMap._interpreter.setWaitMode('animation');
    }

}

//-----------------------------------------------------------
//Bat class

class Bat extends Entity{
    constructor(arg) {
        super(arg);
    }    

    thisInitialize(arg) {
        this._type = 'Bat';
        this._hp = 5;
        this._atk = 1;
        this._def = 0;

        this._atkId = 1;

        this._moveList = ['down', 'ult', 'left', 'right', 'ult'];
    }
}

class Goblin extends Entity{
    constructor(arg) {
        super(arg);
    }    

    thisInitialize(arg) {
        this._type = 'Goblin';
        this._hp = 7;
        this._atk = 2;
        this._def = 0;

        this._atkId = 1;

        this._moveList = ['left', 'ult', 'right', 'right', 'ult'];
    }
}

class Slime extends Entity{
    constructor(arg) {
        super(arg);
    }    

    thisInitialize(arg) {
        this._type = 'Slime';
        this._hp = 1;
        this._atk = 0;
        this._def = 0;

        this._atkId = 1;

        this._moveList = ['down', 'left', 'up', 'right'];
    }
}

class Wraith extends Entity{
    constructor(arg) {
        super(arg);
    }    

    thisInitialize(arg) {
        this._type = 'Wraith';
        this._hp = 3;
        this._atk = 1;
        this._def = 0;

        this._atkId = 1;

        this._moveList = ['left', 'left', 'left', 'left', 'left', 'right', 'right', 'right', 'right', 'right'];
    }
}

//-----------------------------------------------------------
//Player class

class Player extends Entity{
    constructor(arg) {
        super(arg);
    }

    thisInitialize(arg) {
        this._type      = 'Player';
        this._hp        = 5;
        this._atk       = 3;
        this._def       = 0;

        this._atkId = 6;
    }
}

//-----------------------------------------------------------
//Level

class Level {

    constructor(level) {
        this._level = level;
        this._entityList = [];
        //Map Info
        var tmp = 'lvl '.concat(currentLvl, ' completed');
        this._win = $gameSwitches.value(CommonFunction.findSwitch(tmp));

        this._MapName = 'Level ' + this._level;
        this._MapDescription = 'This is fun!';
        this._returnMapInfo = []; //mapId, x, y, direction, fade

        // this.initEnemyData();
        // this.initMapInfo();
    }

    initEnemyData() {
        //later
        //load entity list
        switch (this._level) {
            case -1:
                var bat1 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 1'));
                var goblin1 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 1'));
                var slime1 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 1'));
                var wraith1 = $gameMap._interpreter.character(CommonFunction.findEvent('wraith 1'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Bat',       x: bat1._x,     y: bat1._y,     character: bat1},
                    {type: 'Goblin',       x: goblin1._x,     y: goblin1._y,     character: goblin1},
                    {type: 'Slime',       x: slime1._x,     y: slime1._y,     character: slime1},
                    // {type: 'Wraith',       x: wraith1._x,     y: wraith1._y,     character: wraith1},
                 ];
                break;

            case 0:
                var slime1 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 1'));
                var slime2 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 2'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Slime',     x: slime1._x,   y: slime1._y,   character: slime1},
                    {type: 'Slime',     x: slime2._x,   y: slime2._y,   character: slime2},
                 ];
                break;

            case 1:
                var bat1 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 1'));
                var bat2 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 2'));
                var goblin1 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 1'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Bat',       x: bat1._x,     y: bat1._y,     character: bat1},
                    {type: 'Bat',       x: bat2._x,     y: bat2._y,     character: bat2},
                    {type: 'Goblin',    x: goblin1._x,  y: goblin1._y,  character: goblin1},
                 ];
                break;
                
            case 2:
                var bat1 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 1'));
                var goblin1 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 1'));
                var goblin2 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 2'));
                var slime1 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 1'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Bat',       x: bat1._x,     y: bat1._y,     character: bat1},
                    {type: 'Goblin',    x: goblin1._x,  y: goblin1._y,  character: goblin1},
                    {type: 'Goblin',    x: goblin2._x,  y: goblin2._y,  character: goblin2},
                    {type: 'Slime',     x: slime1._x,   y: slime1._y,   character: slime1},
                 ];
                break;

            case 3:
                var bat1 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 1'));
                var bat2 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 2'));
                var goblin1 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 1'));
                var goblin2 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 2'));
                var slime1 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 1'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Bat',       x: bat1._x,     y: bat1._y,     character: bat1},
                    {type: 'Bat',       x: bat2._x,     y: bat2._y,     character: bat2},
                    {type: 'Goblin',    x: goblin1._x,  y: goblin1._y,  character: goblin1},
                    {type: 'Goblin',    x: goblin2._x,  y: goblin2._y,  character: goblin2},
                    {type: 'Slime',     x: slime1._x,   y: slime1._y,   character: slime1},
                ]
                break;

            case 4:
                var bat1 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 1'));
                var bat2 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 2'));
                var bat3 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 3'));
                var bat4 = $gameMap._interpreter.character(CommonFunction.findEvent('bat 4'));
                var goblin1 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 1'));
                var goblin2 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 2'));
                var goblin3 = $gameMap._interpreter.character(CommonFunction.findEvent('goblin 3'));
                var slime1 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 1'));
                var slime2 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 2'));
                var slime3 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 3'));
                var slime4 = $gameMap._interpreter.character(CommonFunction.findEvent('slime 4'));
                this._entityList = [
                    {type: 'Player',    x: player._x,   y: player._y,   character: player._character},
                    {type: 'Bat',       x: bat1._x,     y: bat1._y,     character: bat1},
                    {type: 'Bat',       x: bat2._x,     y: bat2._y,     character: bat2},
                    {type: 'Bat',       x: bat3._x,     y: bat3._y,     character: bat3},
                    {type: 'Bat',       x: bat4._x,     y: bat4._y,     character: bat4},
                    {type: 'Goblin',    x: goblin1._x,  y: goblin1._y,  character: goblin1},
                    {type: 'Goblin',    x: goblin2._x,  y: goblin2._y,  character: goblin2},
                    {type: 'Goblin',    x: goblin3._x,  y: goblin3._y,  character: goblin3},
                    {type: 'Slime',     x: slime1._x,   y: slime1._y,   character: slime1},
                    {type: 'Slime',     x: slime2._x,   y: slime2._y,   character: slime2},
                    {type: 'Slime',     x: slime3._x,   y: slime3._y,   character: slime3},
                    {type: 'Slime',     x: slime4._x,   y: slime4._y,   character: slime4},
                ]
                break;

            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;

            default:
                console.log('no such level: ', this._level);
                return;
        }

        //add entity to alive entityList
        for (var i of this._entityList) {
            CommonFunction.addEnemy(i);
            //init position info
            i.character._realX = i.character._x = i.x;
            i.character._realY = i.character._y = i.y;
            i.character._direction = DOWN;
        }
        console.log(entityList);
    }

    initMapInfo() {
        //later 
        switch (this._level) {
            case -1: 
                //won't be shown
                this._MapName = 'Test Level';
                this._MapDescription = 'Test Level';
                this._returnMapInfo = [2, 40, 43, UP, 0];
                break;

            case 0: 
                //won't be shown
                this._MapName = 'Tutorial Level';
                this._MapDescription = "Tutorial Level";
                this._returnMapInfo = [3, 5, 10, UP, 0];
                break;
                
            case 1:
                this._MapName = '"A Random Village"';
                this._MapDescription = "Don't lose at the first level...";
                this._returnMapInfo = [2, 18, 43, RIGHT, 0];
                break;

            case 2:
                this._MapName = '"Another Village"';
                this._MapDescription = "It's easy";
                this._returnMapInfo = [2, 5, 44, LEFT, 0];
                break;

            case 3:
                this._MapName = '"Lovely Grass"';
                this._MapDescription = "Am I back to the forest?";
                this._returnMapInfo = [2, 14, 31, UP, 0];
                break;
                
            case 4:
                this._MapName = '"Madness"';
                this._MapDescription = "I'm just trolling lol";
                this._returnMapInfo = [2, 25, 29, UP, 0];
                break;

            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            default:
                console.log('no info of this level: ', this._level);
                return;
        }
        var tmp = 'lvl '.concat(this._level, ' completed');
        this._win = $gameSwitches.value(CommonFunction.findSwitch(tmp));
    }
}


//-----------------------------------------------------------
/*global variables */ {
var player = null; //player object

var currentLvl; //# of lvl
var currentLvlObj = null; //obj of current lvl
var entityList = []; //alive entity on map
var currentTurn = 0;  // count the turn in a game

var maxMove = 5; //maximum #move in a turn

//for repeat move
var moved = 0; //save moved # to move specific character
var originalPosition = null; // store player position before recording moves
var originalDirection = null; // store player direction before recording moves
var reposition = false; //indicator if player has transfer to original position before repeating move

//state
var waiting = false;
var gameFinish = 0; const WIN = 1; const LOSE = 2;

//debug
var triggerEvent = null;
var waitMove = false;
var waitCount = 0;
}

//-----------------------------------------------------------
//main things

class CommonFunction {
    //check input, record player moves
    //called by parallel event
    //*************STH HERE CLEAR THE player._moveList************
    static record() {
        //get player character
        var character = $gameMap._interpreter.character(-1);
        
        //reposition player to starting position
        if (originalPosition == null || originalDirection == null) {
            originalPosition = [character._x, character._y];
            originalDirection = character._direction;
        }

        // disable character movement (prevent fast duplicate input)
        if (waitCount < 20 && waitMove) {
            waitCount++;
            //stop player moving
            SystemFunction.wait(1);
            return;
        }
        else {
            waitCount = 0;
            if (waitMove) {
                waitMove = false;
                return;
            }
        }
        
        //reposition player to starting position
        if (originalPosition == null || originalDirection == null) {
            originalPosition = [character._x, character._y];
            originalDirection = character._direction;
        }
        
        //check if player moving / animation playing
        $gameMap._interpreter._character = $gameMap._interpreter.character(-1);
        $gameMap._interpreter._waitMode = 'route';
        var playerMoving = $gameMap._interpreter.updateWaitMode();
        $gameMap._interpreter._character = player._atkEvent;
        $gameMap._interpreter._waitMode = 'animation';
        var atkMoving = $gameMap._interpreter.updateWaitMode();

        if (!atkMoving && !playerMoving && !(character.isMovementSucceeded() && character.isMoving()) 
            && player._moveList.length < maxMove) {
            // enable checking when player is not moving
            const move = ['up', 'down', 'left', 'right', 'ult'];
            var input = '';
            //check input 
            for (var i of move) {
                if (Input.isPressed(i)) {
                    input = i;
                    var ch = $gameMap._interpreter.character(-1);
                    switch(i) {
                        //if <P> is pressed
                        //play animation and prevent input
                        case 'ult':
                            player.getAttackPosition();
                            player.attackAnimation(player._atkId);

                            // wait animation play before next input / action 
                            SystemFunction.wait(1);
                            break;
                        case 'up':
                            if (!ch.canPass(ch._x, ch._y, UP))
                                // input = '';
                                waitMove = true;
                            break;
                        case 'down':
                            if (!ch.canPass(ch._x, ch._y, DOWN))
                                // input = '';
                                waitMove = true;
                            break;
                        case 'left':
                            if (!ch.canPass(ch._x, ch._y, LEFT))
                                // input = '';
                                waitMove = true;
                            break;
                        case 'right':
                            if (!ch.canPass(ch._x, ch._y, RIGHT))
                                // input = '';
                                waitMove = true;
                            break;
                    }
                    break;
                }
            }
            //save input to array
            if (input != '') {
                // console.log(input);
                player._moveList[player._moveList.length] = input;
                input = '';
                var id = CommonFunction.findVariable('moveLeft');
                $gameVariables.setValue(id, $gameVariables.value(id)-1);
            }
        }

        //proceed to repeat move after 5 moves are recorded
        if (player._moveList.length == maxMove) {
            // console.log(player._moveList);

            //stop record parallel event
            var id = CommonFunction.findEvent('game loop');
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], true);

            $gameSwitches.setValue(CommonFunction.findSwitch('recording'), false);
        }
    }

    //move all entity alive, player -> enemy
    //called by repeated autorun event, check turn!!!
    static repeatMove() {
        if (!reposition){
            //reposition player to orignal position
            var character = $gameMap._interpreter.character(-1);
            character._realX = character._x = player._x = originalPosition[0];
            character._realY = character._y = player._y = originalPosition[1];
            character._direction = player._direction = originalDirection;
            reposition = true;
        }

        for (let i of entityList)
            this.updateEntityPosition(i._character, i);

        var characterObj = entityList[moved];
        var id = moved == 0 ? -1 : characterObj._id;
        var character = $gameMap._interpreter.character(id);
        // var action = characterObj._moveList[currentTurn % characterObj._moveList.length];
        var action = characterObj._moveList[characterObj._moveCounter++];
        characterObj._moveCounter %= characterObj._moveList.length;
        this.entityMove(character, action, moved);

        for (let i of entityList)
            this.updateEntityPosition(i._character, i);

        //check if game finish
        if (gameFinish != 0) {
            var id = CommonFunction.findEvent('game loop');
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'B'], true);
            var id = CommonFunction.findEvent('end');
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], true);
        }

        //update counter
        moved++;
        if (moved >= entityList.length) {
            moved = 0;
            currentTurn++;
        }
        if (currentTurn >= maxMove) {
            moved = 0;
            currentTurn = 0;
            player._moveList = [];
            originalPosition = null;
            originalDirection = null;
            reposition = false;

            var id = CommonFunction.findEvent('game loop');
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
            $gameSwitches.setValue(CommonFunction.findSwitch('repeating'), false);
            var id = CommonFunction.findVariable('moveLeft');
            $gameVariables.setValue(id, 5);
        }
    }

    //move entity according to their moveList
    static entityMove(character, action, movingIndex) {
        //return if entity ald dead
        if (!entityList[movingIndex]._alive)
            return;
        if (action != 'ult') { // action == ('up' || 'down' || 'left' || 'right')
            //set character move route
            var moveCode = 0;
            var flip = movingIndex == 0 ? false : this.wallBump(entityList[movingIndex], action);
            var moveList = [];

            //test for forward back movement of enemy (can rotate entity placement)
            // if (movingIndex == 0) {
                switch (action) {
                    case 'down':    moveCode = flip ? 4 : 1;    break;
                    case 'left':    moveCode = flip ? 3 : 2;    break;
                    case 'right':   moveCode = flip ? 2 : 3;    break;
                    case 'up':      moveCode = flip ? 1 : 4;    break;
                    case '':
                        moveList.push({code: 15, parameters:[1], indent: null});
                        moveCode = 0;
                        break;
                }
                moveList.push({code: moveCode, indent: null}, {code: 0});
            // }
            // else {
            //     switch (action) {
            //         case 'goForward':   //13: forward, 22: turn 180
            //             if (flip) 
            //                 moveList.push({code: 22, indent: null});
            //             moveList.push({code: 13, indent: null});
            //             break;
            //         case 'goBack':      //12: back
            //             if (flip) 
            //                 moveList.push({code: 22, indent: null});
            //             moveList.push({code: 12, indent: null});
            //             break;
            //         case 'goLeft':
            //             if (flip)       //20: turn 90R, 21: turn 90L
            //                 moveList.push({code: 20, indent: null});
            //             else
            //                 moveList.push({code: 21, indent: null});
            //             moveList.push({code: 13, indent: null});
            //             break;
            //         case 'goRight':
            //             if (flip) 
            //                 moveList.push({code: 21, indent: null});
            //             else
            //                 moveList.push({code: 20, indent: null});
            //             moveList.push({code: 13, indent: null});
            //             break;
            //     }
            //     moveList.push({code: 0});
            // }

            //set moveruote
            var moveRoute = {
                list: moveList, //[{code: moveCode, indent: null}, {code: 0}]
                repeat: false,
                skippable: true,
                wait: true,
            };
            character.forceMoveRoute(moveRoute);

            if (movingIndex == 0 || movingIndex == entityList.length-1) {
                $gameMap._interpreter._character = character;
                $gameMap._interpreter.setWaitMode('route');
            }

        }
        else {
            //atk
            entityList[moved].attack();

            //check entity death
            if (this.checkEntityDeath()) { //lose
                gameFinish = 2;
                return;
            }
            if (this.checkWin()) { //win
                gameFinish = 1;
                return;
            }
        }
    }
    
    //update entity position after every move
    static updateEntityPosition(character, characterObj) {
        // console.log('updating :', characterObj._name);
        // console.log(characterObj._x, characterObj._y , "->", character._x, character._y);
        
        //update character, characterObj position
        characterObj._x = character._x;
        characterObj._y = character._y;
        characterObj._position  = [character._x, character._y];
    }

    //flip moveList direction on wall bump
    static wallBump(characterObj, action) {
        switch(action) {
            case 'up':
                if ($gameMap.regionId(characterObj._x, characterObj._y-1) == 1) {
                    this.wallBump_flipAction(characterObj, 'verti');
                    return true;
                }
                break;
            case 'down':
                if ($gameMap.regionId(characterObj._x, characterObj._y+1) == 1) {
                    this.wallBump_flipAction(characterObj, 'verti');
                    return true;
                }
                break;
            case 'left': 
                if ($gameMap.regionId(characterObj._x-1, characterObj._y) == 1) {
                    this.wallBump_flipAction(characterObj, 'hori');
                    return true;
                }
                break;
            case 'right':
                if ($gameMap.regionId(characterObj._x+1, characterObj._y) == 1) {
                    this.wallBump_flipAction(characterObj, 'hori');
                    return true;
                }
                break;
        }
        return false;
    }

    static wallBump_flipAction(characterObj, direction) {
        var d1 = '';
        var d2 = '';
        switch (direction){
            case 'verti': d1 = 'up'; d2 = 'down'; break;
            case 'hori': d1 = 'left'; d2 = 'right'; break;
        }
        for (let i = 0; i < characterObj._moveList.length; i++)
            switch(characterObj._moveList[i]) {
                case d1: characterObj._moveList[i] = d2; break;
                case d2: characterObj._moveList[i] = d1; break;
            }
    }

    //called after anyone atk to check all entity alive
    static checkEntityDeath() { //return true on player death
        console.log('checking entity death');
        //check player death
        if (player._hp <= 0)
            return true;
        //check entity death
        for (let i = 0; i < entityList.length; i++)
            if (entityList[i]._hp <= 0) {
                entityList[i]._alive = false;
                
                //erase event
                $gameMap._events[entityList[i]._id].erase();
                entityList.splice(i, 1);
            }
        return false;
    }

    static gameEnd() {
        //win game
        if (gameFinish == 1){
            //change lvl flag 
            currentLvlObj._win = true;
            var tmp = 'lvl '.concat(currentLvl, ' completed');
            $gameSwitches.setValue(CommonFunction.findSwitch(tmp), true);

            //show win msg
            // console.log('u win');
            var text = 'u win!!!';
            SystemFunction.showSystemMsg([text]);
        }
        
        //lose game
        else {
            //show lose msg
            // console.log('u lose');
            var text = 'u lose...';
            SystemFunction.showSystemMsg([text]);
        }

        //prepare transfer to map
        var mapId = currentLvlObj._returnMapInfo[0];
        var x = currentLvlObj._returnMapInfo[1];
        var y = currentLvlObj._returnMapInfo[2];
        var direction = currentLvlObj._returnMapInfo[3];
        var fade = currentLvlObj._returnMapInfo[4];

        //reset variables
        this.resetVariable();

        //trasnfer to map
        $gamePlayer.reserveTransfer(mapId, x, y, direction, fade);
        $gameMap._interpreter.setWaitMode('transfer');
    }

    //reset variable after a game is finished
    static resetVariable() {
        //variables
        player = null;
        currentLvl = 0;
        currentLvlObj = null;
        entityList = [];
        currentTurn = 0;
        
        moved = 0;
        originalPosition = null;
        originalDirection = null;
        reposition = false;
        
        waiting = false;
        gameFinish = 0;

        //switches
        var id = CommonFunction.findEvent('init');
        $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
        
        var id = CommonFunction.findEvent('player start');
        $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);

        var id = CommonFunction.findEvent('game loop');
        $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
        $gameSelfSwitches.setValue([$gameMap._mapId, id, 'B'], false);
        
        var id = CommonFunction.findEvent('end');
        $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);

        $gameSwitches.setValue(CommonFunction.findSwitch('game ready'), false);
        $gameSwitches.setValue(CommonFunction.findSwitch('recording'), false);
        $gameSwitches.setValue(CommonFunction.findSwitch('repeating'), false);

        //variables
        var id = CommonFunction.findVariable('moveLeft');
        $gameVariables.setValue(id, -1);
    }

//check if game win
    static checkWin() {
        for (var i of entityList)
            if (i._type != 'Player' && i._alive)
                return false;
        return true;
    }

    //add entity to level entityList
    static addEnemy(entity) {

        switch(entity.type) {
            case 'Player':
                entityList.push(player);
                break;
            case 'Bat':
                entityList.push(new Bat(entity));          
                break;
            case 'Goblin':
                entityList.push(new Goblin(entity));          
                break;
            case 'Slime':
                entityList.push(new Slime(entity));          
                break;
            case 'Wraith':
                entityList.push(new Wraith(entity));          
                break;
            
            default:
                console.log('no such entity : ' + entity.type);
                // throw new Error(`no such entity : ${entity.type}`);
                break;
        }
    }

    //find event id by name
    static findEvent(name) {
        for (let i = 1; i < $gameMap._events.length; i++)
            if ($dataMap.events[i] == null)
                continue;
            else if ($dataMap.events[i].name == name)
                return $dataMap.events[i].id;
        console.log('cannot find event: ', name);
    }

    //find switch id by name
    static findSwitch(name) {
        for (let i = 1; i < $dataSystem.switches.length; i++)
            if ($dataSystem.switches[i] == name)
                return i;
        console.log('cannot find switch: ', name);
    }

    //find variable id by name
    static findVariable(name) {
        for (let i = 1; i < $dataSystem.variables.length; i++)
            if ($dataSystem.variables[i] == name)
                return i;
        console.log('cannot find variable: ', name);
    }
}

class SystemFunction {
    static wait(frame) {
        var list = [
            {code: 230, indent: 0, parameters: [frame]},
            {code: 0, indent: 0, paramets: []},
        ]
        $gameMap._interpreter.setup(list, 0);
    }

    static showSystemMsg(texts) {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setFaceImage('', 0);
            $gameMessage.setBackground(1);
            $gameMessage.setPositionType(1);
            for (var i of texts) {
                $gameMessage.add(i);
            }
            $gameMap._interpreter.setWaitMode('message');
        }
    }

    static autoSave() {
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(1)) {
            StorageManager.cleanBackup(1);
        }
    }
}
//script call for RMMV
Game_System.prototype.scriptCallEx = function(id, arg) {
// function testFunc(id, arg) {

    //force interpreter to be the same as current map
    var tmpMapId = $gameMap._interpreter._mapId;
    $gameMap._interpreter._mapId = $gameMap.mapId();
    //get event that trigger the scirpt
    triggerEvent = $gameMap._interpreter.character(0);

    switch(id) {

        //init
        case 'init': // no. of lvl
            var ch = $gameMap._interpreter.character(-1);
            player = new Player({
                character : ch,
                name : 'player',
                x : ch._x,
                y : ch._y,
            });

            currentLvl = arg[0];
            currentLvlObj = new Level(currentLvl);
            currentLvlObj.initEnemyData();
            currentLvlObj.initMapInfo();

            var id = CommonFunction.findEvent('game loop');
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
            $gameSelfSwitches.setValue([$gameMap._mapId, id, 'B'], false);
            var id = CommonFunction.findVariable('moveLeft');
            $gameVariables.setValue(id, 5);
            break;

        //gameover / win game
        case 'end': 
            CommonFunction.gameEnd();
            break;

        //active wait event to disable player move
        case 'waitRecord':
            var id = CommonFunction.findEvent('auto wait');
            if (!waiting) {
                $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], true);
                waiting = true;
            }
            //check <O> button press
            if (Input.isPressed('record')) {
                $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
                waiting = false;
                $gameSwitches.setValue(CommonFunction.findSwitch('recording'), true);
            }
            //enable menu access
            if (Input.isPressed('escape')) {
                SceneManager.push(Scene_Menu);
                Window_MenuCommand.initCommandPosition();
            }
            break;

        case 'record':
            CommonFunction.record();
            break;

        //active wait event to disable player move
        case 'waitRepeat':
            var id = CommonFunction.findEvent('auto wait');
            if (!waiting) {
                $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], true);
                waiting = true;
            }
            //check <O> button press
            if (Input.isPressed('record')) {
                $gameSelfSwitches.setValue([$gameMap._mapId, id, 'A'], false);
                waiting = false;
                $gameSwitches.setValue(CommonFunction.findSwitch('repeating'), true);
            }
            //enable menu access
            if (Input.isPressed('escape')) {
                SceneManager.push(Scene_Menu);
                Window_MenuCommand.initCommandPosition();
            }
            break;

        case 'repeatMove':
            CommonFunction.repeatMove();
            break;

        case 'showMapInfo':
            var ch = $gameMap._interpreter.character(-1);
            player = new Player({
                character : ch,
                name : 'player',
                x : ch._x,
                y : ch._y,
            });
            var level = new Level(arg[0]);

            level.initMapInfo();
            var winText = level._win ? "You have completed this level!" : "You haven't complete this level";
            //call msg command
            SystemFunction.showSystemMsg([level._MapName, level._MapDescription, winText]);
            break;
            
        //later
        case 'bestiary':
            var text1 = 'You cannot read the word.';
            var text2 = '(This is not developed...)';
            //call msg command            
            SystemFunction.showSystemMsg([text1, text2]);
            break;

        // return event mapid, x, y in variable
        case 'getEventXY':
            $gameVariables.setValue(CommonFunction.findVariable('Event MapID'), triggerEvent._mapId);
            $gameVariables.setValue(CommonFunction.findVariable('Event X'), triggerEvent._x);
            $gameVariables.setValue(CommonFunction.findVariable('Event Y'), triggerEvent._y);
            break;

        case 'autoSave':
            SystemFunction.autoSave();
            break;

        case 'clock':
            const date = new Date();
            $gameMessage.add(`Time is now ${date.getHours()}:${date.getMinutes()}, 
                            ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.`);
            $gameMap._interpreter.setWaitMode('message');
            break;

        case 'debug': //DEBUG
            console.log('DEBUGING...');
            break;

        default:
            console.log('no such command');
            throw new Error(`no such command : ${id}, [${arg}]`);
            break;
    }
    
    $gameMap._interpreter._mapId = tmpMapId;
}


/* GAME FLOW
    1. (new game) intro cutscene :
        story, show map(lvl), tutorial (force to start 1st lvl? just msg & graph?)

        enter lvl through world map
        show lvl info and confirmation on touch
        
        record player current position, transfer to lvl map
        disable save
        enter lvl map and start the GAME***

        ***
            (init)
            load player. entity data
            set event position, graphic, link id to data
            check if everything is ready before start???

            (game loop)
            turn :
                (autorun wait)
                disable player movement before start recording
                (can only check bestiary to see entity info)

                (p1 parallel)
                wait for <O> button to record
                click <O> button to start
                start record -> get 5 move input from player , <P> to atk
                    click <R> button to restart

                (p2 autorun)
                move player, entity according to moveList
                    check entity info, check win after each move(atk only?)
                    ,if move invalid
                        skip move

                repeat if not win

            (end)
            after game :
                if lose, 
                    show lose text
                if win, 
                    set level win flag to true
                    change level event switch? on world map
                    show win text
                    transfer play back to world map

        ***

        transfer player back to world map position
        change lvl look on world map if victory

    99. finish all lvl to beat the game

    //actual GAME***
        loop (check win game(#entity == 0 || player hp <= 0)) {
            record stating point

            press <O> to start record
            stop after {n} moves

            press <O> to start repeat move
            transfer player back to starting point

            repeat recorded moves
            player -> monster by id(type)
                skip move when position occupied
                interaction of attack between player, monster

            set end position as new starting point
        }
        if (#entity == 0)
            gvie reward (if have)
            set lvl win state true
        if (player hp == 0)
            gameover

    //things to develop
    JS :
        lvl class : 
            show info (lvl name, beaten, #monster, achivement?), 
            load lvl content when enter lvl
        entity class :
            contruct when enter lvl, 
            move, 
            interact with player
        player in-game movement : 
            record move, 
            play move, sync with monster, 
            interact with monster
        

    RMMV :
        intro, 
        world map, 
        lvl events on map, 
        check lvl comppleted (beat game), 
        call script for dynamic info**
*/


/* NOTES
//javascript

    //CREATING CLASS with function
    function ClassName() { //constructor
        //run init function, with arguments if needed
        this.initialize.apply(this, arguments);
    }

    //PROTOTYPE FUNCTION

    //create function outside constructor for organization
    ClassName.prototype.FunctionName = function() {};

    //extends prototyped functions in SuperClassName
    ClassName.prototype = Object.create(SuperClassName.prototype);

    //to also extends variable, initialize them in SuperClass with init function
    SuperClassName.prototype.initialize = function() {};

    //calling SuperClass prototpyed function
    SuperClassName.prototype.FunctionName.call();

    //add static infront be method callable without constructing the class4
    static methodName() {}

//-----------------------------------------------------------
//RMMV

    //get active event character
    character = $gameMap._interpreter.character(x); x : -1(player), 0(trigger character)

    //get event id
    id = character._eventId;
    
    //check 'alt' pressed
    Input.isPressed('ult'); //P

    //set player move route
    var character = $gameMap._interpreter.character(-1);
    //moveRoute must fol format
    //list[0].code <x> : {1: down, 2: left, 3: right, 4: up}**
    var moveRoute = {
        list: [{code: <x>, indent: null}, {code: 0}],
        repeat: false,
        skippable: true,
        wait: true,
    };
    character.forceMoveRoute(moveRoute);
    $gameMap._interpreter.setWaitMode('route');
*/