    /* Point Array */
	var flag = 0;
	var pNearI;
	var pNearJ;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var ySize = 30; //number of points in y dimension
	var xSize = Math.floor(ySize*width/height); //number of points in the x dimension
	var yDist = window.innerHeight/(ySize-1); //vertical distance between points
	var xDist = window.innerWidth/(xSize-1); //horizontal distance between points
    var point = new Array(xSize);
	var speed = 0.5;
	for (var i = 0; i < xSize; i++) {
            point[i] = new Array(ySize);
			for (var j = 0; j < ySize; j++) {
				point[i][j] = new Point(i,j,i*xDist, j*yDist);
			}
    }
	/*point[0] = new Array(100);
    point[0][0] = new Point(100, 100); // x location of target, y location of target
    point[1] = new Point(200, 350);
    point[2] = new Point(400, 350);
    point[3] = new Point(320, 250);
    point[4] = new Point(440, 190);
    point[5] = new Point(100, 350);
    point[6] = new Point(80, 120);
    point[7] = new Point(130, 240);*/


    /* Point OBJECT */
    function Point(i,j,newX, newY) {
		var i_idx = i
		var j_idx = j
        var x = newX;
        var y = newY;
		var nextX = x
		var nextY = y
        var radius = 2;
        var targetColour = "blue";

        /* public methods */
        this.draw = draw;

        function draw() {
			x = nextX
			y = nextY
            g.beginPath();
            g.fillStyle = targetColour;
            g.arc(x, y, radius, 0, Math.PI * 2);
            g.fill();
            g.closePath();
        }

		function lerp(oldP,newP) {
			return (oldP + (newP - oldP)*speed);
		}
		
		
        
        this.setX = setX;

        function setX(newX) {
            x = newX;
        }

        this.getX = getX;

        function getX() {
            return x;
        }

        this.setY = setY;

        function setY(newY) {
            y = newY;
        }

        this.getY = getY;

        function getY() {
            return y;
        }

        this.getRadius = getRadius;

        function getRadius() {
            return radius;
        }
		
		this.move = move;
        
        function move() {
			isSel = ((i_idx == pNearI) && (j_idx == pNearJ) && (flag == 1))
			if ((((i_idx == 0 || i_idx == (xSize-1)) || j_idx == 0) || j_idx == (ySize-1)) || isSel){
				nextX = x;
				nextY = y;
			} else {
				finX = (point[(i_idx - 1)][j_idx].getX() + 
						point[(i_idx + 1)][j_idx].getX() +
						point[i_idx][(j_idx - 1)].getX() + 
						point[i_idx][(j_idx + 1)].getX())/4;
				finY = (point[(i_idx - 1)][j_idx].getY() + 
						point[(i_idx + 1)][j_idx].getY() +
						point[i_idx][(j_idx - 1)].getY() + 
						point[i_idx][(j_idx + 1)].getY())/4;
				nextX = lerp(x,finX);
				nextY = lerp(y,finY);
			}	
		}
		
	}

		
		


	

    /* MAIN GAME */
    function playGame() {
        g.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas at start.
		g.canvas.width  = window.innerWidth;
		g.canvas.height = window.innerHeight;
        //player.draw();

        for (var i = 0; i < xSize; i++) {
			for (var j = 0; j < ySize; j++){
				point[i][j].move();
			}
			for (var j = 0; j < ySize; j++){
				point[i][j].draw();
			}
			
        }

    }

	var mX
	var mY
	document.addEventListener("mousedown", function(e){
		flag = 1;
		if (e.pageX || e.pageY) { 
			mX = e.pageX;
			mY = e.pageY;
		} else { 
			mX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			mY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		}
		mX -= canvas.offsetLeft;
		mY -= canvas.offsetTop;
		pNearI = Math.round(mX/width*xSize);
		pNearJ = Math.round(mY/height*ySize);
		if (((pNearI == 0 || pNearI == (xSize-1)) || pNearJ == 0) || pNearJ == (ySize-1)){
			return;
		}
		point[pNearI][pNearJ].setX(mX);
		point[pNearI][pNearJ].setY(mY);
	}, false);
	document.addEventListener("mouseup", function(e){
		flag = 0;
	}, false);
	document.addEventListener("mousemove", function(e){
		if(flag === 1){
			if (e.pageX || e.pageY) { 
				mX = e.pageX;
				mY = e.pageY;
			} else { 
				mX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
				mY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
			}
			mX -= canvas.offsetLeft;
			mY -= canvas.offsetTop;
			if (((pNearI == 0 || pNearI == (xSize-1)) || pNearJ == 0) || pNearJ == (ySize-1)){
				return;
			}
			point[pNearI][pNearJ].setX(mX);
			point[pNearI][pNearJ].setY(mY);
		}
		
	}, false);

    /* Get the canvas id */
    var canvas = document.getElementById("simpleCanvas");


    /* Assign a graphics context to the canvas, so that we can draw on it */
    var g = canvas.getContext("2d");

    /* Do the function, call every 30 milliseconds*/
    var theInterval = setInterval(playGame, 20);