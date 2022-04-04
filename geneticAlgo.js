function resetGame() { //probably unnecessary
	//frameCounter = 0;
	//pipes = [];
}

function createNextGeneration() {
	resetGame();
	normalizeFitness(cars);
	aliveCars = generate(cars);
    cars.forEach(elem => destroyCar(elem));
	cars = aliveCars.slice();
}

function generate(oldCars) {
	let newCars = [];
	for (let i = 0; i < oldCars.length; i++) {
		// Select a bird based on fitness
		let car = poolSelection(oldCars);
		newCars[i] = car;
	}
	var max = oldCars[0];
	oldCars.forEach(function(item) {
		if(item.fitness > max.fitness)
			max = item 
	})
	//newCars[0] = max.copy();
	return newCars;
}

function normalizeFitness(cars) {
	let sum = 0;
    cars.forEach(function(item) {
        item.score = Math.pow(item.score, 2)
        sum += item.score
		//console.log(item.score)
    });
    cars.forEach(function(item){
        item.fitness = item.score/sum
		//console.log(item.fitness)
    })

	debugtext.setText(generation + '\n' + sum/cars.length)
}

// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(cars) {
	// Start at 0
	let i = 0;

	// Pick a random number between 0 and 1
	let r = Math.random();

	// Keep subtracting probabilities until you get less than zero
	// Higher probabilities will be more likely to be fixed since they will
	// subtract a larger number towards zero
	while (r > 0 && i < cars.length-1) {
		r -= cars[i].fitness;
		// And move on to the next
		i++
	}

	// Go back one
	i--
	if(i < 0)
		i++

	//console.log(i)	

	// Make sure it's a copy!
	// (this includes mutation)
	return cars[i].copy();
}