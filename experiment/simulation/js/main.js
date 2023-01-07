//Your JavaScript goes in here
// Hello World 
// document.write("Hello World");
import { makeGrid, addFinalStates, valueIteration, completedOrNot, isTerminalState, isObstacle, addObstacles, getNeighbours, calculateNewValue, nextCell, DIRECTIONS, getDirection } from "./required-functions.js";
// window.simulationStatus = simulationStatus;
window.initialize = initialize;
window.change_interval = change_interval;

var grid, newGrid;
var iterations = 0;
var nextCellToCalculate = [0, 0];
var reward = 0, gamma = 0.9;
var clicks = 0, timer;


var time;

function createEquation(neighbourValues) {
	const {
		up,
		down,
		left,
		right,
		rewardDown,
		rewardLeft,
		rewardRight,
		rewardUP,
	} = neighbourValues;
	const result = [];
	const stringArray = [];

	result.push(
		0.8 * (rewardUP + gamma * up) +
		0.1 * (rewardRight + gamma * right) +
		0.1 * (rewardLeft + gamma * left)
	);
	stringArray.push("0.8 * [" + showNumber(rewardUP) + " + " + showNumber(gamma) + " * " + showNumber(up) + "] + 0.1 * [" + showNumber(rewardRight) + " + " + showNumber(gamma) + " * " + showNumber(right) + "] + 0.1 * [" + showNumber(rewardLeft) + " + " + showNumber(gamma) + " * " + showNumber(left) + "]");

	result.push(
		0.8 * (rewardDown + gamma * down) +
		0.1 * (rewardRight + gamma * right) +
		0.1 * (rewardLeft + gamma * left)
	);
	stringArray.push("0.8 * [" + rewardDown + " + " + gamma + " * " + down + "] + 0.1 * [" + rewardRight + " + " + gamma + " * " + right + "] + 0.1 * [" + rewardLeft + " + " + gamma + " * " + left + "]");

	result.push(
		0.8 * (rewardRight + gamma * right) +
		0.1 * (rewardUP + gamma * up) +
		0.1 * (rewardDown + gamma * down)
	);
	stringArray.push("0.8 * [" + rewardRight + " + " + gamma + " * " + right + "] + 0.1 * [" + rewardUP + " + " + gamma + " * " + up + "] + 0.1 * [" + rewardDown + " + " + gamma + " * " + down + "]");


	result.push(
		0.8 * (rewardLeft + gamma * left) +
		0.1 * (rewardUP + gamma * up) +
		0.1 * (rewardDown + gamma * down)
	);
	stringArray.push("0.8 * [" + rewardLeft + " + " + gamma + " * " + left + "] + 0.1 * [" + rewardUP + " + " + gamma + " * " + up + "] + 0.1 * [" + rewardDown + " + " + gamma + " * " + down + "]");
	const index = result.indexOf(Math.max(...result));

	var equation = "V" + "(" + nextCellToCalculate[0] + "," + nextCellToCalculate[1] + ") &xlarr; " + stringArray[index] + " = " + showNumber(result[index]);
	// console.log(equation);
	document.getElementById("value-calculation-paragraph").innerHTML = equation;
	return result[index];

}

function converged() {
	document.getElementById("converged-iterations").innerHTML = iterations;
	document.getElementById("modal1").classList.add("is-visible");
	console.log("converged");
	clearInterval(time);
	// if (time != 0) {
	// 	clearInterval(time);
	// }
}


function clickedOnNextValue(e) {
	var cell = nextCellToCalculate;
	// console.log("clicked on next value", nextCellToCalculate);
	const neighbourValues = calculateNewValue(nextCellToCalculate[0], nextCellToCalculate[1], reward, gamma, grid, 0);
	const value = createEquation(neighbourValues);
	// console.log(value);

	// console.log(grid);
	newGrid[nextCellToCalculate[0]][nextCellToCalculate[1]] = value;
	nextCellToCalculate = nextCell(nextCellToCalculate[0], nextCellToCalculate[1], grid);
	if (nextCellToCalculate[0] === 0 && nextCellToCalculate[1] === 0) {
		iterations++;
		document.getElementById("iteration-number").innerHTML = iterations;
		// console.log(completedOrNot(grid, newGrid));
		if (completedOrNot(grid, newGrid)) {
			// alert("Value Iteration has converged");
			converged();
		}
		grid = structuredClone(newGrid);
		constructTable(grid);

		nextCellToCalculate = [0, 0];
	}
	constructTable(grid);
	var reqCell = document.getElementById("cell2" + cell[0] + cell[1]);
	var oldColor = reqCell.style.backgroundColor;
	reqCell.animate({ backgroundColor: "grey" }, 1500);


	reqCell = document.getElementById("cell" + cell[0] + cell[1]);
	oldColor = reqCell.style.backgroundColor;
	reqCell.animate({ backgroundColor: "#263034" }, 2000);

	var neighbours = getNeighbours(cell[0], cell[1], grid);
	for (var i = 0; i < neighbours.length; i++) {
		reqCell = document.getElementById("cell" + neighbours[i].x + neighbours[i].y);
		oldColor = reqCell.style.backgroundColor;
		reqCell.animate({ backgroundColor: "lightgrey" }, 1500);
	}

}

function clickedOnNextIteration(e) {
	// console.log("clicked on next iteration");
	grid = valueIteration(grid, reward, gamma);
	iterations++;
	// console.log(iterations);
	document.getElementById("iteration-number").innerHTML = iterations;
	newGrid = structuredClone(grid);
	nextCellToCalculate = [0, 0];
	// console.log(grid);
	constructTable(grid);
	if (grid.completed === true) {
		// alert("Value Iteration has converged");
		converged();
	}

}
function showNumber(x) {
	if (hasTwoZeroDecimals(x)) return x.toExponential(2);
	if (x === -2) {
		x = 0;
	}
	return parseFloat(x).toFixed(3);
}

function colourFinalStates(grid) {
	// console.log(grid);
	var gridSize = grid.size[0];
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			var cell = document.getElementById("cell" + i + j);
			var cell2 = document.getElementById("cell2" + i + j);
			if (grid[i][j] === 1) {
				cell.style.backgroundColor = "green";
				cell.style.color = "white";
				cell2.style.backgroundColor = "green";
				cell2.style.color = "white";
			} else if (grid[i][j] === -1) {
				cell.style.backgroundColor = "red";
				cell.style.color = "white";
				cell2.style.backgroundColor = "red";
				cell2.style.color = "white";
			} else if (grid[i][j] === -2) {
				cell.style.backgroundColor = "black";
				cell.style.color = "white";
				cell2.style.backgroundColor = "black";
				cell2.style.color = "white";
			} else {
				cell.style.backgroundColor = "white";
				cell.style.color = "black";
				cell2.style.backgroundColor = "white";
				cell2.style.color = "black";
			}
		}
	}
}


function hasTwoZeroDecimals(x) {
	let z = x.toString();
	if (z.indexOf(".") === -1) return false;
	z = z.split(".")[1];
	return z[0] === "0" && z[1] === "0";
}
function singleClickedOnCell(e) {
	var cell = e.target;
	var cellId = cell.id;
	var cellIdArray = cellId.split("cell");

	var x = parseInt(cellIdArray[1][0]);
	var y = parseInt(cellIdArray[1][1]);
	if (isTerminalState(x, y, grid)) {
		return;
	}
	if (isObstacle(x, y, grid)) {
		grid[x][y] = 0;
		newGrid[x][y] = 0;
		// console.log("obstacle removed")
		colourFinalStates(grid);
		return;
	}
	// console.log(x, y);

	addObstacles(x, y, -2, grid);
	grid[x][y] = -2;
	newGrid[x][y] = -2;
	// console.log("obstacle added")
	colourFinalStates(grid);
}
function clickedOnCell(e) {

	clicks++;  //count clicks	
	if (clicks === 1) {
		timer = setTimeout(function () {
			singleClickedOnCell(e);
			clicks = 0;             //after action performed, reset counter
		}, 300);
	} else {
		clearTimeout(timer);
		// console.log("yes")  //prevent single-click action
		doubleClickedOnCell(e);
		clicks = 0;             //after action performed, reset counter
	}
}

function doubleClickedOnCell(e) {
	// console.log(e.detail);
	var cell = e.target;
	var cellId = cell.id;
	var cellIdArray = cellId.split("cell");

	var x = parseInt(cellIdArray[1][0]);
	var y = parseInt(cellIdArray[1][1]);
	if (isObstacle(x, y, grid)) {
		return;
	}
	if (isTerminalState(x, y, grid)) {
		if (grid[x][y] === 1) {
			grid[x][y] = -1;
			newGrid[x][y] = -1;
			for (let i = 0; i < newGrid.finalStates.length; i++) {
				const state = newGrid.finalStates[i];
				if (state.x === x && state.y === y) {
					newGrid.finalStates[i].value = -1;
					grid.finalStates[i].value = -1;
					break;
				}
			}
		}
		else {
			grid[x][y] = 0;
			newGrid[x][y] = 0;
			for (let i = 0; i < newGrid.finalStates.length; i++) {
				const state = newGrid.finalStates[i];
				if (state.x === x && state.y === y) {
					newGrid.finalStates.splice(i, 1);
					grid.finalStates.splice(i, 1);
					break;
				}
			}
		}
	}
	else {
		grid[x][y] = 1;
		newGrid[x][y] = 1;
		newGrid.finalStates.push({ x: x, y: y, value: 1 });
		grid.finalStates.push({ x: x, y: y, value: 1 });
	}
	// console.log(x, y, grid[x][y]);

	// colourFinalStates(grid);
	constructTable(grid);
}

function constructTable(grid) {
	var gridSize = grid.size[0];
	var table = document.createElement("table");
	table.setAttribute("id", "grid");
	for (var i = 0; i < gridSize; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < gridSize; j++) {
			var cell = document.createElement("td");
			cell.setAttribute("id", "cell" + i + j);
			cell.setAttribute("class", "cell");
			cell.setAttribute("onclick", "clickedOnCell(event)");
			// cell.setAttribute("ondblclick", "doubleClickedOnCell(event)");
			cell.onclick = clickedOnCell;
			// cell.ondblclick = doubleClickedOnCell;

			cell.appendChild(document.createTextNode(showNumber(grid[i][j])));

			if (!isTerminalState(i, j, grid) && !isObstacle(i, j, grid)) {
				var arrow = document.createElement("i");
				var classname = "fa-solid fa-arrow-" + DIRECTIONS.toString(getDirection(i, j, grid));
				arrow.setAttribute("class", classname);
				arrow.setAttribute("id", "arrow" + i + j);

				cell.appendChild(arrow);
			}

			row.appendChild(cell);
		}
		table.appendChild(row);
	}


	////////////////////////////////////////

	var table2 = document.createElement("table");
	table2.setAttribute("id", "grid");
	table2.setAttribute("class", "grid2");
	for (var i = 0; i < gridSize; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < gridSize; j++) {
			var cell = document.createElement("td");
			cell.setAttribute("id", "cell2" + i + j);
			cell.setAttribute("class", "cell");
			// cell.setAttribute("onclick", "clickedOnCell(event)");
			// cell.onclick = clickedOnCell;
			if (nextCellToCalculate[0] > i || (nextCellToCalculate[0] == i && nextCellToCalculate[1] > j)) {
				cell.appendChild(document.createTextNode(showNumber(newGrid[i][j])));
			}
			else {
				cell.appendChild(document.createTextNode(showNumber(0)));
			}

			// if(!isTerminalState(i, j, grid) && !isObstacle(i, j, grid)) {
			// 	var arrow = document.createElement("i");
			// 	var classname = "fa-solid fa-arrow-"+ DIRECTIONS.toString(getDirection(i, j, grid));
			// 	arrow.setAttribute("class", classname);
			// 	arrow.setAttribute("id", "arrow" + i + j);

			// 	cell.appendChild(arrow);
			// }

			row.appendChild(cell);
		}
		table2.appendChild(row);
	}


	document.getElementById("matrix").innerHTML = "";
	document.getElementById("matrix").appendChild(table);
	var nextIteration = document.createElement("h2");
	nextIteration.setAttribute("id", "nextIteration-smallscreen");
	nextIteration.setAttribute("class", "next-iteration-display");
	nextIteration.appendChild(document.createTextNode("Next Iteration"));
	document.getElementById("matrix").appendChild(nextIteration);
	document.getElementById("matrix").appendChild(table2);
	var observation = document.createElement("h2");
	observation.setAttribute("id", "observation-smallscreen");
	observation.setAttribute("class", "next-iteration-display");
	observation.appendChild(document.createTextNode("Observations"));
	document.getElementById("matrix").appendChild(observation);
	colourFinalStates(grid);
}

var nextValue = document.getElementById("next-value");
if (nextValue != null)
	nextValue.addEventListener("click", clickedOnNextValue);

var nextIteration = document.getElementById("next-iteration");
if (nextIteration)
	nextIteration.addEventListener("click", clickedOnNextIteration);
var gridSizeSelect;
var gridSize, reward, discountFactor;
var rewardSelect, discountFactorSelect;



function start() {
	if (grid.completed || newGrid.completed) {
		if(document.getElementById("start").value == "End")
		{
			reset();
		}
		else{
			document.getElementById("start").value = "End";
		}
		return;

	}
	if (document.getElementById("start").value == "Start") {
		started = true;
		time = setInterval(clickedOnNextValue, 3000 - document.getElementById("interval").value);
		document.getElementById("start").value = "Next";
		document.getElementById("pause").disabled = false;
		document.getElementById("pause").style.backgroundColor = "#288ec8";
		document.getElementById("reset").disabled = false;
		document.getElementById("reset").style.backgroundColor = "#288ec8";
		document.getElementById("reset").style.cursor = "pointer";
		document.getElementById("pause").style.cursor = "pointer";
	}
	else if (document.getElementById("start").value == "Next") {
		clearInterval(time);
		if (onpause) {
			clickedOnNextIteration();
		} else {
			clickedOnNextIteration();
			time = setInterval(clickedOnNextValue, 3000 - document.getElementById("interval").value);
		}
	}
	else {
		reset();
	}
}

function pause() {
	if(!started){
		return;
	}
	if (grid.completed || newGrid.completed) {
		return;
	}
	if (document.getElementById("start").value == "Start") return;
	if (document.getElementById("pause").value == "Pause") {
		if (time != 0)
			clearInterval(time);
		document.getElementById("pause").value = "Resume";
		onpause = 1;
	}
	else {
		if (time != 0)
			clearInterval(time);
		time = setInterval(clickedOnNextValue, 3000 - document.getElementById("interval").value);
		document.getElementById("pause").value = "Pause";
		onpause = 0;
	}
}
function reset() {
	onpause = 0;
	started = false;
	if (time != 0) {
		clearInterval(time);
	}
	iterations = 0;
	document.getElementById("converged-iterations").innerHTML = 0;
	initialize();
}
function change_interval() {
	if(!started){
		return;
	}
	if (grid.completed || newGrid.completed) {
		return;
	}
	if (time != 0) { clearInterval(time); }
	if (document.getElementById("interval").value != 100) {
		clearInterval(time);
		time = setInterval(clickedOnNextValue, 3000 - document.getElementById("interval").value);
		document.getElementById("pause").style.backgroundColor = "#288ec8";
	}
	else document.getElementById("pause").style.backgroundColor = "grey";
}

function initialize() {
	
	document.getElementById("start").value = "Start";
	document.getElementById("pause").value = "Pause";
	onpause = 0;
	started = false;
	if (time != 0) {
		clearInterval(time);
	}
	iterations = 0;
	document.getElementById("converged-iterations").innerHTML = 0;
	gridSizeSelect = document.getElementById("grid-sizes");
	var value = gridSizeSelect.value;
	gridSize = parseInt(value);

	rewardSelect = document.getElementById("reward");
	reward = rewardSelect.value;
	reward = parseFloat(reward);

	discountFactorSelect = document.getElementById("discount");
	var discountFactor = discountFactorSelect.value;
	discountFactor = parseFloat(discountFactor);
	gamma = discountFactor;


	grid = makeGrid(gridSize);

	grid = addFinalStates(0, 2, 1, grid);
	grid = addFinalStates(1, 2, -1, grid);
	grid[1][0] = -2;
	newGrid = structuredClone(grid);
	constructTable(grid);

	// console.log(grid);

}
initialize();
gridSizeSelect.addEventListener("change", function (e) {
	gridSize = parseInt(e.target.value);
	// console.log(gridSize);
	// constructTable(gridSize);
	initialize();
});

rewardSelect.addEventListener("change", function (e) {
	reward = parseFloat(e.target.value);
	// console.log(reward);
	// constructTable(gridSize);
	initialize();
});

discountFactorSelect.addEventListener("change", function (e) {
	gamma = parseFloat(e.target.value);
	// console.log(gamma);
	// constructTable(gridSize);
	initialize();
});


const closeEls = document.querySelectorAll("[data-close]");
const isVisible = "is-visible";
var onpause = 0, started = 0;

for (const el of closeEls) {
	el.addEventListener("click", function () {
		this.parentElement.parentElement.parentElement.classList.remove(isVisible);
		// initialize();
	});
}

function handlers() {
	document.getElementById("reset").onclick = function () { reset(); };
	document.getElementById("start").onclick = function () { start(); };
	document.getElementById("pause").onclick = function () { pause(); };
};
handlers();
