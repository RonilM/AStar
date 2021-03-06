
/*
	USAGE:
		var partialObstacleArray = [[1,2],[3,3],[4,4]];
		var numberOfRows = 8;
		var numberOfColumns = 8; 
		var divID = 'grid-div';

		var board = new Board(divID,numberOfRows,numberOfColumns,partialObstacleArray,[]);
		board.init();
		board.moveAgent('right');
		board.moveAgent('down');
		board.moveAgent('right');
		board.moveAgent('right'); 
		

*/



var Board = function(canvasID,rowCount,columnCount,partialObstacleArr,highways,PBHighways, blocked) {
	var xmlns = "http://www.w3.org/2000/svg";
	var canvas;
	var boxWidth = 5;
	var boxHeight = 5;
	var boxStore = {};

	var boxColor = '#FFFFFF';
	var obstacleColor = '#966f6f';
	var agentColor = '#0000FF';
	var highwayColor = '#1aff1a';
	var PBHighwayColor = '#fbff1a';
	var pathColor = '#0000FF';
	var blockedColor = '#000000';
	var currentBox = {'x':0,'y':0};
	var animationIndex  = 0;
	var self = this;

	init();

	Board.prototype.getGrid = function() {
		return boxStore;
	}

	Board.prototype.moveAgent = function(x,y) {
		var timeInterval = animationIndex*100; 
		setTimeout(function() { move.apply(this,[x,y]); }, timeInterval);
		animationIndex += 1;
	}	

	Board.prototype.addPath = function(path) {
		for(var i in path) {
			var xy = path[i];
			convertToPath(xy.x,xy.y,boxStore,self);
		}
	}


	function init() {
		canvas = document.getElementById(canvasID);
		//canvas.style.setAttribute("height", rowCount*boxHeight*10);
		//canvas.style.setAttribute("width",columnCount*boxWidth*10);
		canvas.style.height = rowCount*boxHeight*2;
		canvas.style.width = columnCount*boxWidth*2;

		var svg = document.createElementNS(xmlns,'svg');
		svg.setAttribute("id",'map-svg');
		svg.setAttribute("width",columnCount*boxWidth*2);
		svg.setAttribute("height", rowCount*boxHeight*2);
		canvas.appendChild(svg);

		for(var i=0;i<rowCount;i++) {
			for(var j=0; j<columnCount ;j++){
				var rect = document.createElementNS(xmlns,'rect');
				var y = i*boxHeight;
				var x = j*boxWidth;
				rect.setAttributeNS(null, 'x', x);
		        rect.setAttributeNS(null, 'y', y);
		        rect.setAttributeNS(null, 'width', boxWidth);
		        rect.setAttributeNS(null, 'height', boxHeight);
		        rect.setAttributeNS(null, 'style', 'fill:#FFFFFF;stroke-width:1;stroke:#CCC');
		        if(boxStore[i] == null) {
		        	boxStore[i] = {};
		        }
		        boxStore[i][j] = {'DOMElement':rect , 'Code':'1', 'x':i,'y':j};
				svg.appendChild(rect);

			}
		}

		for(var i in partialObstacleArr) {
			var xy = partialObstacleArr[i];
			convertToPartialObstacle(xy[0],xy[1],boxStore,2);
		}

		for(var i in blocked) {
			var xy = blocked[i];
			convertToBlocked(xy[0],xy[1],boxStore);
		}
		//HIGHWAYS
		for(var key in highways) {
			for(var i in highways[key]) {
				var arr = highways[key]; 
				var xy = arr[i];
				convertToHighway(xy[0],xy[1],boxStore,'a'+key);
			}
		}

		//PBHIGHWAYS
		for(var key in PBHighways) {
			for(var i in PBHighways[key]) {
				var arr = PBHighways[key]; 
				var xy = arr[i];
				convertToPBHighway(xy[0],xy[1],boxStore,'b'+key);
			}
		}

		//START POSITION
		/*if(boxStore[0] == null || boxStore[0][0] == null || boxStore[0][0].DOMElement == null) {
			return;
		}
		var DomElement = boxStore[0][0].DOMElement;
		boxStore[0][0].isObstacle = false;
		DomElement.setAttributeNS(null, 'style', 'fill:'+agentColor+';stroke-width:1;stroke:#CCC');*/
	}


	function move(x,y) {
		var transisitionTime = 200;

		/*function reduceOpacity(i,DomElement) {
			var color = agentColor;
			if(i < (n/2-1)) {
				//DomElement.setAttributeNS(null, 'style', 'fill:'+color+';stroke-width:1;stroke:#CCC;opacity:'+(n/2-1-i)*0.2);
			}
			else {
				color = boxColor;
				//DomElement.setAttributeNS(null, 'style', 'fill:'+color+';stroke-width:1;stroke:#CCC;opacity:1');	
			}
		}*/

		function increaseOpacity(i,DomElement) {
			var color = agentColor;
			if(i != n-1) {
				DomElement.setAttributeNS(null, 'style', 'fill:'+color+';stroke-width:1;stroke:#CCC;opacity:'+i*0.2);
			}
			else {
				DomElement.setAttributeNS(null, 'style', 'fill:'+color+';stroke-width:1;stroke:#CCC;opacity:1');	
				def.resolve();
			}
		}

		//var current = getCurrentBox();
		
		/*for(var i = 0 ; i < n/2 ; i++) {
			var DomElement = current.DOMElement;
			reduceOpacity(i,DomElement);
					
		}*/

		updateCurrentBox(x,y);
		var current = getCurrentBox();
		var n = 10;
		var def = $.Deferred();

		for(var i = 0 ; i < n/2 ; i++) {	
				var DomElement = current.DOMElement;
				increaseOpacity(i,DomElement);
		}
		return def.promise();
	}


	function updateCurrentBox(x,y) {

		currentBox = {'x':x,'y':y};

	}


	function getCurrentBox() {
		return boxStore[currentBox['x']][currentBox['y']];
	}


	function deltaCurrentBox(dx,dy) {
		currentBox = {'x':currentBox.x + dx,'y':currentBox.y + dy}
	}


	function convertToPartialObstacle(x,y,boxStore,value) {
		if(boxStore[x] == null || boxStore[x][y] == null || boxStore[x][y].DOMElement == null) {
			console.log("REPORT: Cannot be a partial obstacle");
			return;
		}
		var DomElement = boxStore[x][y].DOMElement;
		boxStore[x][y].isPartialObstacle = true;
		boxStore[x][y].Code = value+"";
		DomElement.setAttributeNS(null, 'style', 'fill:'+obstacleColor+';stroke-width:1;stroke:#CCC');

	}

	function convertToBlocked(x,y,boxStore) {
		if(boxStore[x] == null || boxStore[x][y] == null || boxStore[x][y].DOMElement == null) {
		console.log("REPORT: Cannot be a partial obstacle");
		return;
		}
		var DomElement = boxStore[x][y].DOMElement;
		boxStore[x][y].isBlocked = true;
		boxStore[x][y].Code = '0';
		DomElement.setAttributeNS(null, 'style', 'fill:'+blockedColor+';stroke-width:1;stroke:#CCC');

	}

	function convertToHighway(x,y,boxStore,highwayNumber) {
		if(boxStore[x] == null || boxStore[x][y] == null || boxStore[x][y].DOMElement == null) {
			console.log("REPORT: Cannot be a highway");
			return;
		}
		var DomElement = boxStore[x][y].DOMElement;
		boxStore[x][y].isHighway = true;
		boxStore[x][y].Code = highwayNumber;
		DomElement.setAttributeNS(null, 'style', 'fill:'+highwayColor+';stroke-width:1;stroke:#CCC');

	}

	function convertToPBHighway(x,y,boxStore,highwayNumber) {
		if(boxStore[x] == null || boxStore[x][y] == null || boxStore[x][y].DOMElement == null) {
			console.log("REPORT: Cannot be a PBhighway");
			return;
		}
		var DomElement = boxStore[x][y].DOMElement;
		boxStore[x][y].isPBHighway = true;
		boxStore[x][y].Code = highwayNumber;
		DomElement.setAttributeNS(null, 'style', 'fill:'+PBHighwayColor+';stroke-width:1;stroke:#CCC');

	}

	function convertToPath(x,y,boxStore,ins) {
		if(boxStore[x] == null || boxStore[x][y] == null || boxStore[x][y].DOMElement == null) {
		console.log("REPORT: Cannot be a path for "+x+","+y);
		return;
		}
		var de = boxStore[x][y].DOMElement;
		//var titleElemen = document.createElementNS(null,"title");
		//titleElemen.innerHTML = boxStore[x][y].g + "";
		//de.appendChild(titleElemen);
		//de.innerHTML = boxStore[x][y].g + "";
		de.addEventListener('click',function(evt){
			document.getElementById('g-val').innerHTML = boxStore[x][y].g;
			document.getElementById('h-val').innerHTML = boxStore[x][y].h;
			document.getElementById('f-val').innerHTML = boxStore[x][y].f;
			
		});
		//de.className += "final-path";
		de.setAttributeNS(null, 'class', "final-path");

		ins.moveAgent(x,y);
		
		//boxStore[x][y].isBlocked = true;
		//boxStore[x][y].Code = '0';
		//DomElement.setAttributeNS(null, 'style', 'fill:'+pathColor+';stroke-width:1;stroke:#CCC');

	}


	

}








