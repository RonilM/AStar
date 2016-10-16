// Priority Queue
	
var Astar = function(grid, start, goal, generateHeuristicCostArg,hWeight) {
	//console.log(start);
	//var grid = grid1;
	var costMap = {};
	var retResult = [];
	var countNodes = 0;
	
	init();
	var path = search();
	
	Astar.prototype.getFinalPath = function() {
		return path;
	}


	Astar.prototype.path = function() {
		return ret.reverse();
	}

	Astar.prototype.getCountNodes = function() {
		return countNodes;
	}


	function init() {
		
		createCostMap();
		for(var x in grid) {
			for(var y in grid[x]) {
				//console.log(grid[x][y]);
				grid[x][y].f = 99999;
				grid[x][y].g = 99999;
				grid[x][y].isVisited = false;
				grid[x][y].isInQueue = false;
				grid[x][y].parent = null;
			}	
		}
	}

	

	function search() {
		//console.log(grid);
		var startTime = new Date().getTime();
		console.log("GO!");
		var priorityQ   = new PriorityQueue();
		//var closedList = [];
		grid[start.x][start.y].g = 0;
		priorityQ.enqueue(grid[start.x][start.y].g+generateHeuristicCost(start.x,start.y,goal.x,goal.x),grid[start.x][start.y]);
		grid[start.x][start.y].isInQueue = true;

		while(priorityQ.isEmpty() != true) {
			//console.log("In while!");
			var vertexS = priorityQ.dequeue();
			countNodes++;

			//console.log(vertexS);
			vertexS.isVisited = true; 
			vertexS.isInQueue = false;
			//console.log(vertexS);
	
			if(vertexS.x == goal.x && vertexS.y == goal.y) {
				//console.log("!!!!!!!!!");
				var curr = vertexS;
				var ret = [];
				while(curr) {
					ret.push(curr);
					curr = curr.parent;
				}
				//console.log("path = " + ret.reverse());
				//console.log(ret);
				var endTime = new Date().getTime();
				var timeElapsed = endTime - startTime;
				retResult[0] = ret.reverse();
				retResult[1] = timeElapsed;
				console.log(countNodes);
				return retResult;
			}


			// var indexPQ = priorityQ.indexOf(vertexS);
			// priorityQ.splice(indexPQ,1);
			//priorityQ.remove(vertexS);
			//closedList.push(vertexS);
			var neighbors = getNeighbors(grid, vertexS);


			for(var i=0; i<neighbors.length;i++) {
					var neighbor = neighbors[i];
					//var isValid = nodeObstacle(neighbor);
					//var x = neighbor.x;
					//var y = neighbor.y;
					//var val = closedList.indexOf(neighbor);
					//console.log("value = " + val);
					if(neighbor.isVisited == true || neighbor.Code == 0) {
						continue;
					}
					//console.log(getCost(vertexS, neighbor));
					if(neighbor.g > vertexS.g + getCost(vertexS, neighbor)){
						neighbor.g = vertexS.g + getCost(vertexS, neighbor);  // getDistance (costs)
						if(!neighbor.isInQueue) {
							neighbor.h = generateHeuristicCost(neighbor.x,neighbor.y,goal.x,goal.y);
							neighbor.f = neighbor.g + neighbor.h;
							priorityQ.enqueue(neighbor.g+generateHeuristicCost(neighbor.x,neighbor.y,goal.x,goal.y),neighbor);
							
						}
						else {
							priorityQ.sort(neighbor);	
						}
						neighbor.parent = vertexS;
						
					}
					//var gValueIsBest = false;
					//var priorityQValue = priorityQ.indexOf(neighbor);
					
					
					
					
			}
		}
		var endTime = new Date().getTime();
		var timeElapsed = endTime - startTime;
		retResult[0] = [];
		retResult[1] = timeElapsed;
		return retResult;
	}




	function getNeighbors(grid, node) {
		var ret = [];
		var x = node.x;
		var y = node.y;

		if(grid[x-1] && grid[x-1][y]) {
			ret.push(grid[x-1][y]);
		}

		if(grid[x+1] && grid[x+1][y]) {
			ret.push(grid[x+1][y]);
		}
		if(grid[x] && grid[x][y-1]) {
			ret.push(grid[x][y-1]);
		}
		if(grid[x] && grid[x][y+1]) {
			ret.push(grid[x][y+1]);
		}
		if(grid[x-1] && grid[x-1][y-1]) {
			ret.push(grid[x-1][y-1]);
		}
		if (grid[x-1] && grid[x-1][y+1]) {
			ret.push(grid[x-1][y+1]);
		}
		if (grid[x+1] && grid[x+1][y+1]) {
			ret.push(grid[x+1][y+1]);
		}
		if (grid[x+1] && grid[x+1][y-1]) {
			ret.push(grid[x+1][y-1]);
		}
		return ret;
	}

	
	function createCostMap(){
		//costMap = {};
		costMap['0'] = {};
		costMap['1'] = {};
		costMap['2'] = {};
		costMap['a'] = {};
		costMap['b'] = {};

		var cellTypes = ['0','1','2','a','b'];

		costMap['0']['0'] = { 'horizontal' : 0} ;
		costMap['0']['0'].vertical = 0;
		costMap['0']['0'].diagonal = 0;

		costMap['0']['1'] = { 'horizontal' : 0} ;
		costMap['0']['1'].vertical = 0;
		costMap['0']['1'].diagonal = 0;

		costMap['0']['2'] = { 'horizontal' : 0} ;
		costMap['0']['2'].vertical = 0;
		costMap['0']['2'].diagonal = 0;

		costMap['0']['a'] = { 'horizontal' : 0} ;
		costMap['0']['a'].vertical = 0;
		costMap['0']['a'].diagonal = 0;

		costMap['0']['b'] = { 'horizontal' : 0} ;
		costMap['0']['b'].vertical = 0;
		costMap['0']['b'].diagonal = 0;

		costMap['1']['0'] = { 'horizontal' : 0} ;
		costMap['1']['0'].vertical = 0;
		costMap['1']['0'].diagonal = 0;

		costMap['1']['1'] = { 'horizontal' : 1} ;
		costMap['1']['1'].vertical = 1;
		costMap['1']['1'].diagonal = Math.sqrt(2);

		costMap['1']['2'] = { 'horizontal' : 1.5} ;
		costMap['1']['2'].vertical = 1.5;
		costMap['1']['2'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['1']['a'] = { 'horizontal' : 0.25} ;
		costMap['1']['a'].vertical = 0.25;
		costMap['1']['a'].diagonal = Math.sqrt(2);

		costMap['1']['b'] = { 'horizontal' : 0.375} ;
		costMap['1']['b'].vertical = 0.375;
		costMap['1']['b'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['2']['0'] = { 'horizontal' : 0} ;
		costMap['2']['0'].vertical = 0;
		costMap['2']['0'].diagonal = 0;

		costMap['2']['1'] = { 'horizontal' : 1.5} ;
		costMap['2']['1'].vertical = 1.5;
		costMap['2']['1'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['2']['2'] = { 'horizontal' : 2} ;
		costMap['2']['2'].vertical = 2;
		costMap['2']['2'].diagonal = Math.sqrt(8);

		costMap['2']['1'] = { 'horizontal' : 1.5} ;
		costMap['2']['1'].vertical = 1.5;
		costMap['2']['1'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['2']['a'] = { 'horizontal' : 0.375} ;
		costMap['2']['a'].vertical = 0.375;
		costMap['2']['a'].diagonal = Math.sqrt(2);

		costMap['2']['b'] = { 'horizontal' : 0.5} ;
		costMap['2']['b'].vertical = 0.5;
		costMap['2']['b'].diagonal = Math.sqrt(8);		

		costMap['a']['0'] = { 'horizontal' : 0} ;
		costMap['a']['0'].vertical = 0;
		costMap['a']['0'].diagonal = 0;

		costMap['a']['1'] = { 'horizontal' : 1} ;
		costMap['a']['1'].vertical = 1;
		costMap['a']['1'].diagonal = Math.sqrt(2);

		costMap['a']['2'] = { 'horizontal' : 1.5} ;
		costMap['a']['2'].vertical = 1.5;
		costMap['a']['2'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['a']['a'] = { 'horizontal' : 0.25} ;
		costMap['a']['a'].vertical = 0.25;
		costMap['a']['a'].diagonal = 99999;

		costMap['a']['b'] = { 'horizontal' : 0.375} ;
		costMap['a']['b'].vertical = 0.375;
		costMap['a']['b'].diagonal = 99999;

		costMap['b']['0'] = { 'horizontal' : 0} ;
		costMap['b']['0'].vertical = 0;
		costMap['b']['0'].diagonal = 0;

		costMap['b']['1'] = { 'horizontal' : 1.5} ;
		costMap['b']['1'].vertical = 1.5;
		costMap['b']['1'].diagonal = (Math.sqrt(2) + Math.sqrt(8))/2.0;

		costMap['b']['2'] = { 'horizontal' : 2} ;
		costMap['b']['2'].vertical = 2;
		costMap['b']['2'].diagonal = Math.sqrt(8);

		costMap['b']['a'] = { 'horizontal' : 0.375} ;
		costMap['b']['a'].vertical = 0.375;
		costMap['b']['a'].diagonal = 99999;

		costMap['b']['b'] = { 'horizontal' : 0.5} ;
		costMap['b']['b'].vertical = 0.5;
		costMap['b']['b'].diagonal = 99999;
	}

	function getCost(currentNode, nextNode) {
		var dist = getDistance(currentNode.x,currentNode.y,nextNode.x,nextNode.y);
		var retVal;
		if(currentNode.x != nextNode.x && currentNode.y != nextNode.y) {
			//horizonal or vertical
			//console.log(currentNode.Code.charAt(0)+","+nextNode.Code.charAt(0));
			retVal = costMap[currentNode.Code.charAt(0)][nextNode.Code.charAt(0)].diagonal; 	
			if(retVal == null){
				alert(currentNode.Code.charAt(0)+","+nextNode.Code.charAt(0))
			}
			return parseFloat(retVal.toFixed(2));
		}
		//diagonal
		
		retVal = costMap[currentNode.Code.charAt(0)][nextNode.Code.charAt(0)].horizontal; 
		if(retVal == null){
			alert(currentNode.Code.charAt(0)+","+nextNode.Code.charAt(0))
		}
		return parseFloat(retVal.toFixed(2));
	}


	function getDistance(sx,sy,ex,ey) {
		return Math.sqrt( (sx-ex)*(sx-ex) + (sy-ey)*(sy-ey) );
	}

	function generateHeuristicCost(x,y,goalx,goaly) {
		x = parseInt(x);
		y = parseInt(y);
		goalx = parseInt(goalx);
		goaly = parseInt(goaly);

		return hWeight*generateHeuristicCostArg(x,y,goalx,goaly);

	}

	// function nodeObstacle(adjacentNode) {
	// 	return neighbor.isObstacle;


	// 	// if(grid[x][y].isObstacle) {
	// 	// 	return 1;
	// 	// }
	// 	// return 0;
	// }

	


}