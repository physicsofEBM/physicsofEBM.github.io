var energy_figure_id = "#energy_landscape_figure_id"

// 2. Use the margin convention practice
var margin = {top: 0, right: 50, bottom: 50, left: 20}

var element = document.getElementById("energy_landscape");
var positionInfo = element.getBoundingClientRect();
var height_new = positionInfo.height;
var width_new = positionInfo.width;

// The number of datapoints for the graph
var n = 32;
// The number of actual points for images
var n_points = 6;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width_new-margin.right]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 1]) // input
    .range([height_new, 0]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
function init_dataset(){
var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(0.1,1.0)() } })
dataset[0].y=0.9
dataset[31].y=0.9 //Fix most left and right points
return dataset
}
dataset = init_dataset()
var points_data = [8,24]

//for (i=0; i<Math.floor(n/n_points); i++) {points_data.push(i*Math.floor(n/n_points)+1)}

// 1. Add the SVG to the page and employ #2
var svg_img = d3.select(energy_figure_id).append("svg")
    .attr("width", width_new)
    .attr("height", 50)
var svg = d3.select(energy_figure_id).append("svg")
    .attr("width", width_new)
    .attr("height", height_new)
  .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Random initial positions
var images_list = [0,1];
image_for_node = svg_img.append('image')
    .attr('xlink:href', 'scripts_and_figs/figures/images_with_gaussian_noise/noisy_image_'+images_list[0]+'.jpg')
    .attr("x", 20)
    .attr("y", 0)
    .attr("width", 50)
    .attr("height", 50)

// 9. Append the path, bind the data, and call the line generator
line_energy = svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "plotline") // Assign a class for styling
    .attr("d", line)
	.style("stroke", c_energy_landscape_line)
	.style("stroke-width", energy_landscape_line_stroke)
	.style("fill", "none" ); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
circle_energy = svg.selectAll(".dot_energy_img")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot_energy_img") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", radius_non_data)
    .style("fill", c_non_data_dots)
    .attr("id", function(d,i){return "noisy_images"+i})
	.on("click", function(d,i){
		    		image_for_node.attr('xlink:href', 'scripts_and_figs/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg')	})
	.on("mouseover", function(d,i){
		    		image_for_node.attr('xlink:href', 'scripts_and_figs/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg')	})

for (j=0;j<points_data.length;j++){
	element = d3.select("#"+"noisy_images"+points_data[j])
	element.style("fill", c_data_dots)
	element.attr("r", radius_data)

}
neighbour1 = [5,6,7,8,9,10,11]
neighbour2 = [21,22,23,24,25,26,27]
learning_steps = 0
unlearning_steps = 0
learn_adjust = 0.1
unlearn_adjust = 0.06

function learn_phase(){
	update1 = dataset[8].y - learn_adjust
	update2 = dataset[24].y - learn_adjust
	if (update1>0.02){
	dataset[8].y = update1}
	if (update2>0.02){
	dataset[24].y = update2}
	//update_line(0, 400)
	//learning_fct_image_energies((learning_steps-unlearning_steps)*10)
}

function unlearn_phase(){
	minimas = find_local_minima()
	minimas.forEach(
		function(element){
			update = dataset[element].y + unlearn_adjust
			if (update<0.95 ){
			dataset[element].y = update}
		}
	)
	//learning_fct_image_energies((learning_steps-unlearning_steps)*10)
	//update_line(0, 200)
}

function unlearn_training(){
	for (i=0; i<20; i++){
		step_length = 500
		learn_phase()
		update_line(2*i*step_length, step_length)
		unlearn_phase()
		update_line((2*i+1)*step_length, step_length)
		unlearning_fct_image_energies(2*i)
		unlearning_fct_image_energies(2*i+1)
	}
}

function learn_training(){
	for (i=0; i<20; i++){
		step_length = 500
		learn_phase()
		update_line(i*step_length, step_length)
		learning_fct_image_energies(i)
	}
}

function reinitialize_phase(){
	learning_steps = 0
	unlearning_steps = 0
	dataset = init_dataset()
	//learning_fct_image_energies(0)
	update_line(0, 1000)
	step_length = 500
	reinitialize_image_energies()
}

function update_line(delay, duration){
line_energy.datum(dataset)
	.transition().delay(delay).duration(duration)
    .attr("d", line)

circle_energy.data(dataset).transition()
	.attr("cy", function(d){return yScale(d.y)}).delay(delay).duration(duration)
}

function find_local_minima(){
	minima_idx = []
	a = dataset[0].y
	for (j=1;j<n-1;j++){
		b= dataset[j].y
		c= dataset[j+1].y
	if (b<a){
		if(b<c){
		minima_idx.push(j)}}
	a = dataset[j].y}
	return minima_idx
}

tester = find_local_minima()
