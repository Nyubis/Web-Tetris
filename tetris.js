var cs = 16	//canvas size in tiles
var ts = 20	//tile size in pixels
var ctx 	//global context
var playing	//not game over
var lines = 0

function Shape(){
	this.pos = [cs/2-1, -1]
	this.type = parseInt(Math.random() * tetrominoes.length)
	this.piece = tetrominoes[this.type];
	//this.color = "hsl(" + Math.pow(parseInt(Math.random() * 16), 2) + ",75%,50%)"
}

var s;

var tetrominoes = [	[[0,1],[1,1],[2,1],[3,1]],	// I
					[[0,0],[0,1],[1,1],[1,0]],	// O
					[[0,1],[1,1],[2,1],[2,0]],	// L
					[[0,1],[1,1],[2,1],[0,0]],	// J
					[[1,0],[2,0],[0,1],[1,1]],	// S
					[[0,0],[1,0],[1,1],[2,1]],	// Z
					[[1,0],[0,1],[1,1],[2,1]]	// T	
				  ]
					
var colors = [	"00FFFF",
				"FFFF00",
				"FFA500",
				"0000FF",
				"00FF00",
				"FF0000",
				"FF00FF" ]
				
var solid = new Array(cs)
for (var i = 0; i<cs; i++){
	solid[i] = new Array(cs)
	for (var j=0;j<cs;j++){
		solid[i][j]=0;
	}
}

function init(){
	var canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx=canvas.getContext('2d');
		playing = true;
		s = new Shape();
		setInterval(tick, 500);
	}else{
		document.write("<h1>Canvas not supported</h1><p>Please get a proper browser.</p>");
	}
}

function drawShape(piece, x, y) {
	ctx.fillStyle=colors[s.type];
	for (var i = 0; i<piece.length; i++){
		ctx.fillRect((x + piece[i][0])*ts, (y + piece[i][1])*ts,ts,ts)
	}
}

function clearShape(piece, x, y) {
	for (var i = 0; i<piece.length; i++){
		ctx.clearRect((x + piece[i][0])*ts, (y + piece[i][1])*ts,ts,ts)
	}
}

function tick() {
	if(playing){
		if(s.piece, detect(s.piece, 0,1)){
			for (var j = 0; j<s.piece.length; j++){
				b = s.piece[j]
				solid[s.pos[0]+b[0]][s.pos[1]+b[1]] = s.type+1;	//soldify the shape, store the color as well
			}
			
			clearLines();
			
			s = new Shape();
			drawShape(s.piece, s.pos[0], s.pos[1]);
			
			if(detect(s.piece, 0,0)){
				playing = false;
				alert("Game over.")
			}
		}else{
			clearShape(s.piece, s.pos[0], s.pos[1]);
			s.pos[1]++
			ctx.fillStyle=s.color;
			drawShape(s.piece, s.pos[0], s.pos[1]);
		}
	}
}

function detect(shape, incX, incY) {
	for (var i = 0; i<shape.length; i++){
		if ( (shape[i][0]+s.pos[0]+incX < 0) || (shape[i][0]+s.pos[0]+incX == cs) || (shape[i][1]+s.pos[1]+incY == cs) || (solid[shape[i][0]+s.pos[0]+incX][shape[i][1]+s.pos[1]+incY]) ){
		//get the value in solid of the x+pos and y+pos+1 of the block, or see if the y+1 value equals canvas size
			return true;
		}
	}
}

document.onkeydown=function(e){
	var e=window.event || e
	switch(e.keyCode){
		case 37: //left
			if(!detect(s.piece,-1,0)){
				clearShape(s.piece, s.pos[0], s.pos[1]);
				s.pos[0]--;
				drawShape(s.piece, s.pos[0], s.pos[1]);
			}
			break;
		case 38: //up
			dirs = s.type==0 ? [0, -1, 1, -2, 2] : [0, -1, 1];
			for (var i in dirs){
				if(!detect(rotate(),dirs[i],0)){
					clearShape(s.piece, s.pos[0], s.pos[1]);
					s.piece = rotate()
					s.pos[0]+=dirs[i];
					drawShape(s.piece, s.pos[0], s.pos[1]);
					break;
				}
			}
			break;
		case 39: //right
			if(!detect(s.piece,1,0)){
				clearShape(s.piece, s.pos[0], s.pos[1]);
				s.pos[0]++;
				drawShape(s.piece, s.pos[0], s.pos[1]);
			}
			break;
		case 40: //down
			if(!detect(s.piece,0,1)){
				clearShape(s.piece, s.pos[0], s.pos[1]);
				s.pos[1]++;
				drawShape(s.piece, s.pos[0], s.pos[1]);
			}
			break;
	}
}

function max(x){
	var highest = 0;
	for(var i in x){
		var val = (x[i] instanceof Array) ? max(x[i]) : x[i]
		highest = Math.max(val, highest)
	}
	return highest;
}

function rotate(){
	var dimension = max(s.piece)
	var newpiece = new Array(s.piece.length)
	for (var i=0;i<newpiece.length;i++){ newpiece[i] = new Array(s.piece[0].length); }
	for (var j = 0; j<s.piece.length; j++){	//blocks
		x = s.piece[j][0]
		y = s.piece[j][1]
		newpiece[j][0] = dimension-y;
		newpiece[j][1] = x
	}
	return newpiece;
}

function clearLines(){
	for (var line=0; line<cs; line++){
		var flag = true;
		for (var col=0; col<cs; col++){
			if(!solid[col][line])
				flag = false;
		}
		if(flag){
		lines++;
		document.getElementById("score").innerHTML = "Lines: " + lines;
			for (var col=0;col<cs;col++)
				for (var j=line;j>0;j--){
					solid[col][j] = solid[col][j-1];
			}
			ctx.clearRect(0,0,cs*ts,cs*ts);
			for (var i=0; i<cs; i++){
				for (var j=0; j<cs; j++){
					if(solid[i][j]){
						ctx.fillStyle=colors[solid[i][j]-1]
						ctx.fillRect(i*ts,j*ts,ts,ts)
					}
				}
			}
		}
	}
}
