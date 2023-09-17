/*

                                            The Game Project Final 


        1. Create platforms - Use the factory pattern to create platforms
        
            I found some difficulty with setting the if condition for the floor of the platform.
            
            I practiced the factory pattern to spawn multiple platforms  
        
        2. Create enemies - Use a constructor function to create enemies  
        
            While creating the constructor I struggled a bit with its positioning. I placed it in the fixed initial x position which was provided thriough the constructor and was able to spawn the enemy in the location indicated however as the character would scroll through the world the enemy would costantly scroll with him leaving his initial location. This was quite annoying however I realized that the enemy was moving in relation with scrollpos hence I used a translate function that would take this into account and add the scrollposs value to the x value keeping the enemy within the location which passed through the constructor. 
            
            To implement this I learnt how to create constructor functions and call them to perform a task hence reducing the lines of code as I can call the constuctor as many times as I wish increasing my coding efficiency. I learned to use the dist() function to measure the distance between the character and the enemy to see whether the enemy is in contact with the character. I also used the range function to make sure the character moves back and forth between a specific range instead of goiang all the way through the map.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons = [];
var flagpole;
var lives;
var platforms; 

var enemies;

var game_score;

function setup() 
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}

function draw() 
{
    // fill the sky blue
	background(12, 45, 72);
    // draw some ground
	noStroke();
	fill(5, 68, 94);
	rect(0, floorPos_y, width, height/4); 
    
    push();
    translate(scrollPos,0);
	// Draw clouds.
    drawCloud();
	// Draw mountains.
    drawMountain();
	// Draw trees.
    drawTrees();
    // Draw Platforms.
    for(var i=0; i<platforms.length; i++)
    {
        platforms[i].draw();
    }
	// Draw canyons.
    for(var i=0; i<canyons.length; i++) 
    {
        checkCanyon(canyons[i]);
        drawCanyon(canyons[i]);
    }
	// Draw collectable items.
    for(var i=0; i<collectables.length; i++) 
    {
        if(collectables[i].isFound == false)
        {
            checkCollectable(collectables[i]);
            drawCollectable(collectables[i]);
        }
    }
    // Draw flagpole.
    renderFlagpole();
    pop();
	// Draw game character.
	drawGameChar();
    // Display Score
    fill(255);
    noStroke();
    text("SCORE : " + game_score,20 ,20);
    // Display Lives
    fill(255);
    noStroke();
    text("LIVES : ",20 ,40);
    for(var i=0; i<lives; i++) 
    {
        fill(255,0,0);
        size = 0.06;
        var heart_x = 60+(i*20);
        var heart_y = 23;
        beginShape();
        vertex(size*200 + heart_x,size*350 + heart_y);
        bezierVertex(size*200 + heart_x, size*250 + heart_y, 
                     size*350 + heart_x, size*200 + heart_y, 
                     size*350 + heart_x, size*150 + heart_y);
        bezierVertex(size*350 + heart_x, size*100 + heart_y, 
                     size*250 + heart_x, size*50  + heart_y, 
                     size*200 + heart_x, size*140 + heart_y);
        bezierVertex(size*150 + heart_x, size*50  + heart_y, 
                     size*50  + heart_x, size*100 + heart_y, 
                     size*50  + heart_x, size*150 + heart_y);
        bezierVertex(size*50  + heart_x, size*200 + heart_y, 
                     size*200 + heart_x, size*250 + heart_y, 
                     size*200 + heart_x, size*350 + heart_y);
        endShape();
    }
    // Check Flagpole
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    for(var i=0; i<enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y);
        
        if(isContact)
        {
                if(lives>0)
                {
                        startGame();
                        break;
                }
        }
    }
    // Check Playerdie
    checkPlayerDie();
    // Display Game Over
    if(lives<1)
    {
        background(0,0,0);
        push();
        textSize(50);
        text("Game over.",350,height/2-50);
        textSize(40);
        text("Press space to continue.",250,height/2+100);
        pop();
        return null;
    }
    // Display Level Complete
    if(flagpole.isReached == true)
    {
        background(255);
        push();
        textSize(50);
        text("Level complete.",350,height/2-50);
        textSize(40);
        text("Press space to continue.",308,height/2+100);
        pop();
        return null;
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

    if(isPlummeting == true)
    {
        isLeft = false;
        isRight = false;
        gameChar_y += 20;
    }
    
	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i <platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                isFalling = false;
                break;
            }
        }
       
        if(isContact == false)
        {
            gameChar_y += 3;
            isFalling = true;    
        }
    }
    else
    {
        isFalling = false;
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.

	//open up the console to see how these work
    
    if(keyCode == 37)
    {
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        isRight = true;
    }
    
    else if(keyCode == 38)
    {
        if(!isFalling)
        {
            gameChar_y -= 150;
        }        

    }
    
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    
    if(keyCode == 37)
    {
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        isRight = false;
    }
    else if(keyCode == 38)
    {
        isFalling = true;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling) 
    {
        // add your jumping-left code
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left
        push();
        translate(PositionX+5,PositionY+64);
        rotate(5.8);
        rect(0, 0, BodyWidth-46, BodyHeight-43, 0, 0, 10, 10);
        pop();

        //Right
        push();
        translate(PositionX+28,PositionY+65);
        rotate(5.8);
        rect(0, 0, BodyWidth-46, BodyHeight-43, 0, 0, 10, 10);
        pop();

        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 2, 15, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+4, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+4, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-9, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+13, PositionY+31.5, Size*17, 8, 5);
        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+36, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);

        //Left
        rect(PositionX-2, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
        
	}
    
	else if(isRight && isFalling) 
    {
		// add your jumping-right code
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left
        push();
        translate(PositionX+6,PositionY+60);
        rotate(6.5);
        rect(0, 0, BodyWidth-46, BodyHeight-42, 0, 0, 10, 10);
        pop();
        //Right
        push();
        translate(PositionX+29,PositionY+60);
        rotate(6.5);
        rect(0, 0, BodyWidth-46, BodyHeight-42, 0, 0, 10, 10);
        pop();

        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 15, 2, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+6, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+11, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-5, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+17, PositionY+31.5, Size*17, 8, 5);
        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+36, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
        //Left
        rect(PositionX-2, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
    }
	
    else if(isLeft)
    {
		// add your walking left code
        
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left
        push();
        translate(PositionX+6,PositionY+60);
        rotate(6.6);
        rect(0, 0, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);
        pop();

        //Right
        push();
        translate(PositionX+25,PositionY+61);
        //rotate(6.1);
        rect(0, 0, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);
        pop();

        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+30, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);

        //Left
        rect(PositionX, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 2, 15, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+4, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+4, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-9, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+12, PositionY+31.5, Size*17, 8, 5);
	}
    
	else if(isRight) 
    {
        // add your walking right code
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left  
        push()
        translate(PositionX+24, PositionY+65);
        rotate(5.8);
        rect(0, 0, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);
        pop();
        //Right
        push()
        translate(PositionX+4,PositionY+62);
        rect(0, 0, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);
        pop();
        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+30, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);

        //Left
        rect(PositionX, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 15, 2, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+6, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+11, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-5, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+17, PositionY+31.5, Size*17, 8, 5);
	}
    
	else if(isFalling || isPlummeting) 
    {
		// add your jumping facing forwards code
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left
        rect(PositionX+6, PositionY+60, BodyWidth-46, BodyHeight-42, 0, 0, 10, 10);

        //Right
        rect(PositionX+25, PositionY+60, BodyWidth-46, BodyHeight-42, 0, 0, 10, 10);

        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 15, 2, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+6, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+11, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-5, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+17, PositionY+31.5, Size*17, 8, 5);

        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+36, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);

        //Lett
        rect(PositionX-2, PositionY+20, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
	}
    
	else 
    {
		// add your standing front facing code
        Size = 0.75;
        PositionX = gameChar_x-21;
        PositionY = gameChar_y-75;
        BodyWidth = 55;
        BodyHeight = 55;

        //Body
        fill(252, 46, 32);
        rect(PositionX+4, PositionY+40, BodyWidth-23, BodyHeight-30, 3, 3, 10, 10);

        //Legs
        fill(253, 127, 32);
        rect(PositionX+4, PositionY+55, BodyWidth-23, BodyHeight-45, 0, 0, 10, 10);

        //Left
        rect(PositionX+6, PositionY+60, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);

        //Right
        rect(PositionX+25, PositionY+60, BodyWidth-46, BodyHeight-37, 0, 0, 10, 10);
        //Hands
        //Right
        fill(244,164,96);
        rect(PositionX+30, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);

        //Lett
        rect(PositionX, PositionY+40, BodyWidth-47, BodyHeight-30, 10, 10, 10, 10);
        //Head
        fill(0);
        rect(PositionX, PositionY, Size*BodyWidth, Size*BodyHeight, 15, 2, 13, 14);
        //Face
        fill(244,164,96);
        rect(PositionX+6, PositionY+19, Size*43, 10, 4.8);
        rect(PositionX+6, PositionY+19, Size*43, 10, 4.8);
        //Eyes
        fill(0);
        ellipse(gameChar_x+11, gameChar_y-51, 4, 6);
        ellipse(gameChar_x-5, gameChar_y-51, 4, 6);
        //Mouth
        fill(184,63,63);
        rect(PositionX+17, PositionY+31.5, Size*17, 8, 5);
	}   
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud()
{
   for(var i = 0; i<clouds.length; i++)
   {
        fill(177, 212, 224);
        rect(clouds[i].x_pos, clouds[i].y_pos, 180, clouds[i].width + 29, 20);
        rect(clouds[i].x_pos + 10, clouds[i].y_pos-20, 160, clouds[i].width + 39, 30);
        rect(clouds[i].x_pos + 30, clouds[i].y_pos-40, 120, clouds[i].width + 69, 30);
        ellipse(clouds[i].x_pos + 90, clouds[i].y_pos-10, 80, clouds[i].width + 80);
        noStroke();
    }
}

// Function to draw mountains objects.
function drawMountain()
{
// Draw mountains.
    for(var i = 0; i<mountains.length; i++)
    {
        push();
        translate(mountains[i].x_pos,0);
        fill(20,93,160);
        triangle(
             169, 432,
             mountains[i].widthX+568, 431, 
             mountains[i].widthX+368, 99-mountains[i].heightY);
        fill(5, 10, 48);
        quad(169, 431, 
             mountains[i].widthX+568, 431, 
             mountains[i].widthX+368, 99-mountains[i].heightY,
             mountains[i].widthX+358, 229-mountains[i].heightY);
        fill(5, 10, 48);
        triangle(29, 432, 
             mountains[i].widthX+428, 431, 
             mountains[i].widthX+238, 159-mountains[i].heightY);
        fill(20,93,160);
        quad(29, 431,
             29, 431, 
             mountains[i].widthX+238, 269-mountains[i].heightY, 
             mountains[i].widthX+238, 159-mountains[i].heightY);
        pop();
    }
}

// Function to draw trees objects.
function drawTrees()
{
    // Draw trees.
    for(var i = 0; i<trees_x.length; i++)
    {
        fill(79, 58, 48);
        rect(trees_x[i], floorPos_y-150, 40 ,150);
        fill(212, 150, 75);
        rect(trees_x[i]+7, floorPos_y-50, 7,22,10);
        rect(trees_x[i]+25, floorPos_y-20, 7,7,10);
        rect(trees_x[i]+30, floorPos_y-70, 7,27,10);
        fill(28,155,142); 
        triangle(trees_x[i]-20, floorPos_y-150, 
                 trees_x[i]+20, floorPos_y-290, 
                 trees_x[i]+80, floorPos_y-150)
        fill(33, 182, 168);
        noStroke();
        triangle(trees_x[i]-30, floorPos_y-150, 
                 trees_x[i]+20, floorPos_y-290, 
                 trees_x[i]+20, floorPos_y-150)
        fill(28,155,142); 
        noStroke();
        triangle(trees_x[i]-40, floorPos_y-80, 
                 trees_x[i]+20, floorPos_y-290, 
                 trees_x[i]+90, floorPos_y-80)
        fill(33, 182, 168);
        noStroke();
        triangle(trees_x[i]-40, floorPos_y-80, 
                 trees_x[i]+20, floorPos_y-290, 
                 trees_x[i]+20, floorPos_y-80)
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    // Canyons
        fill(0, 31, 61);
        quad(t_canyon.x_pos+18, 580, t_canyon.width+t_canyon.x_pos-14, 
             580, t_canyon.width+t_canyon.x_pos, 
             430, t_canyon.x_pos, 430);
        fill(126, 200, 227);
        quad(t_canyon.x_pos+28, 580, 
             t_canyon.x_pos+t_canyon.width-24, 
             580, t_canyon.x_pos+t_canyon.width-10, 
             430, t_canyon.x_pos+10, 430);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && 
       gameChar_world_x<(t_canyon.x_pos + t_canyon.width) && 
       gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
    else{
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
        //Collectable
        push();
        translate(t_collectable.x_pos, t_collectable.y_pos);
        scale(t_collectable.size);
        //shade
        fill(170,108,57);
        ellipse(2, 2,57,57);
        //outer circl+e
        fill(220,200,55);
        ellipse(0, 0,60,60);
        //inner circle
        fill(170,108,57);
        ellipse(0, 0,50,50);
        //symbol
        fill(220,200,55);
        rect(-15, -16, 31, 31, 7);
        pop();

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    let collectable_dist = int(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos-21, t_collectable.y_pos));
    if(collectable_dist<40)
    {
        t_collectable.isFound = true;
        game_score = game_score +1;
    }
}

// Function to draw flagpole
function renderFlagpole()
{
    if (flagpole.isReached == true)
    {
        fill(0);
        rect(flagpole.x_pos, floorPos_y, 10,-400);
        fill(255,0,0);    
        rect(flagpole.x_pos+10, floorPos_y-400, 100,75);
    }
    
    if (flagpole.isReached == false)
    {
        fill(0);
        rect(flagpole.x_pos, floorPos_y, 10,-400);
        fill(255,0,0);    
        rect(flagpole.x_pos+10, floorPos_y-100, 100,75);
    }
    
}


function checkFlagpole(){
    var distance = abs(gameChar_world_x - flagpole.x_pos);
    if (distance < 10)
    {
        flagpole.isReached = true;
    }
}
function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        lives = lives - 1;
        if(lives != 0 && lives > 0)
        {
            startGame();
        }
        else
        {
            lives = 0;
        }
    }
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    //Array for the X position of trees
    trees_x = [600, 0, 200, 950, 770, 1200, 1500,1700,1850, 2000,4350,2400, 4600, 2850, 3100, 4800,3500, 3750, 3900, 4000];
    //Array for cloud objects
    clouds = [{x_pos: 400, y_pos: 100, width: 1},
              {x_pos: 80, y_pos: 80, width: 1},
              {x_pos: 900, y_pos: 90, width: 1},
              {x_pos: 1200, y_pos: 100, width: 1},
              {x_pos: 1500, y_pos: 70, width: 1},
              {x_pos: 2000, y_pos: 90, width: 1},
              {x_pos: 2500, y_pos: 80, width: 1},
              {x_pos: 3100, y_pos: 100, width: 1},
              {x_pos: 2800, y_pos: 95, width: 1},
              {x_pos: 3800, y_pos: 70, width: 1},
              {x_pos: 4500, y_pos: 89, width: 1},
              {x_pos: 5000, y_pos: 90, width: 1},
              {x_pos: 5100, y_pos: 110, width: 1},
              {x_pos: 5300, y_pos: 90, width: 1}              
             ];
    //Array for mountain objects
    mountains = [{x_pos: -330, widthX: 1, heightY: 1},
                {x_pos: 0, widthX: 1, heightY: 1},
                {x_pos: 1800, widthX: 1, heightY: 1},
                {x_pos: 2100, widthX: 1, heightY: 1},
                {x_pos: 3500, widthX: 1, heightY: 1},
                {x_pos: 4000, widthX: 1, heightY: 1}
                ];
    //Array for collectable objects
    collectables = [{x_pos: 700, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 1200, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 1700, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 1900, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 2125, y_pos: 350, size: 0.8, isFound: false},
                    {x_pos: 2220, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 2400, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 4450, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 2560, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 3700, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 4780, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 2850, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 4890, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 3950, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 3000, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 4200, y_pos: 400, size: 0.8, isFound: false},
                    {x_pos: 3300, y_pos: 400, size: 0.8, isFound: false}
                    ];
    //Array for canyons objects
    canyons =  [{x_pos: 70, width: 120,isFound: false},
                {x_pos: 1070, width: 120,isFound: false},
                {x_pos: 2070, width: 120,isFound: false},
                {x_pos: 3270, width: 120,isFound: false},
                {x_pos: 2570, width: 120,isFound: false}
               ];
    //Initialize Platforms 
    platforms = [];
    platforms.push(createPlatforms(350,floorPos_y-100,100));
    platforms.push(createPlatforms(580,floorPos_y-85,100));
    platforms.push(createPlatforms(1070,floorPos_y-90,100));
    platforms.push(createPlatforms(1500,floorPos_y-80,100));
    platforms.push(createPlatforms(3750,floorPos_y-96,100));
    platforms.push(createPlatforms(1950,floorPos_y-84,100));
    platforms.push(createPlatforms(2650,floorPos_y-100,100));
    platforms.push(createPlatforms(3350,floorPos_y-95,100));
    platforms.push(createPlatforms(4350,floorPos_y-89,100));
    platforms.push(createPlatforms(4550,floorPos_y-92,100));
    platforms.push(createPlatforms(4850,floorPos_y-100,100));
    platforms.push(createPlatforms(5150,floorPos_y-94,100));
    platforms.push(createPlatforms(2100,floorPos_y-89,100));
    platforms.push(createPlatforms(2900,floorPos_y-96,100));

    //Initialize Enemies.
    enemies = [];
    enemies.push(new Enemy(200,floorPos_y - 10, 100));
    enemies.push(new Enemy(600,floorPos_y - 10, 100));    
    enemies.push(new Enemy(900,floorPos_y - 10, 100));
    enemies.push(new Enemy(1500,floorPos_y - 10, 100));
    enemies.push(new Enemy(2000,floorPos_y - 10, 100));
    enemies.push(new Enemy(3500,floorPos_y - 10, 100));
    enemies.push(new Enemy(4500,floorPos_y - 10, 100));
    enemies.push(new Enemy(4300,floorPos_y - 10, 100));
    enemies.push(new Enemy(3100,floorPos_y - 10, 100));

    //Initialize Game Score
    game_score = 0;
    //Array for flagpole
    flagpole = {x_pos: 5120, isReached: false};
}

function createPlatforms (x, y, length)
{
    var p = 
    {
        x: x ,
        y: y ,
        length: length,
        draw: function()
        {
            fill(5, 198, 244);
            rect(this.x, this.y, this.length, 20, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x-10 && gc_x < this.x + (this.length+10))
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if (this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        push();
        scale(1/2);
        translate(this.currentX + 2*scrollPos,this.y+8);
        fill(27, 74, 86	);
        rect(this.currentX-25, this.y-5, 20, 15, 5);
        rect(this.currentX+4, this.y-5, 20, 15, 5);
        push();
        fill(84, 106, 123);
        translate(this.currentX,this.y-22);
        rotate(PI - 0.20);        
        arc(0, 0, 80, 80, 0, PI + PI/8, CHORD);
        pop();
        fill(84, 106, 123);
        rect(this.currentX-40, this.y-30, 80, 30, 20);        
        fill(187, 231, 254);
        rect(this.currentX+8, this.y-73, 25, 25, 5);
        fill(27, 74, 86	);
        ellipse(this.currentX+25,this.y-60,10,10);
        fill(187, 231, 254);
        rect(this.currentX-30, this.y-73, 25, 25, 5);
        fill(27, 74, 86	);
        ellipse(this.currentX-15,this.y-60,10,10);
        fill(187, 231, 254);
        rect(this.currentX-21, this.y-34, 45, 25, 10);
        pop();
    }
    
    this.checkContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x,gc_y,this.currentX,this.y);
        
        if(d < 30)
        {
            lives =lives-1;
            return true;
        }
        return false;
    }
}