const energy_minima_temp_id = "#energy_minima_and_temp_id"


// 2. Use the margin convention practice
var margin = {top: 0, right: 50, bottom: 50, left: 20}

var element = document.getElementById("Figure_energy_minima_and_temp");
var positionInfo = element.getBoundingClientRect();
var height_new = positionInfo.height;
var width_new = positionInfo.width;

temp_slider_energy_minim_init_value = 1

document.getElementById("temperature_slider_energy_minima").innerHTML = temp_slider_energy_minim_init_value;

var x_temp_energy = d3.scalePow()
     .exponent(2)
     .domain([0.01, 100])
     .range([0.1, 10.05])
     .clamp(true);

document.getElementById("temp_slider_energy_minima_id").value=1
document.getElementById("temperature_slider_energy_minima").innerHTML = x_temp_energy(1).toPrecision(2)


//document.getElementById("coupling_strength").value = temp_slider_energy_minim_init_value

// The number of datapoints for the graph
var n = 32;
// The number of actual points for images
var n_points = 6;

var pos_list = 0;

// 5. X scale will use the index of our data
var x_scale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([5, width_new-margin.right]); // output

// 6. Y scale will use the randomly generate number
var y_scale = d3.scaleLinear()
    .domain([0, 1]) // input
    .range([height_new, 0]); // output

// 7. d3's line generator
var plot_line = d3.line()
    .x(function(d, i) { return x_scale(i); }) // set the x values for the line generator
    .y(function(d) { return y_scale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var plot_data = d3.range(n).map(function(d) {
	return {"y":0.35*Math.cos(d/n*Math.PI*4)-0.2*d/n+0.54 , "c":0} })

plot_data[0].c = 0

// 1. Add the SVG to the page and employ #2
var svg_2 = d3.select(energy_minima_temp_id).append("svg")
    .attr("width", width_new)
    .attr("height", height_new)
  //.append("g")
   //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   svg_2.append("text")
    .attr("id", "Temp_Energy_Text_Id")
    .attr("class", "annotation")
    .attr("x", 25)
    .attr("y", 270)
    .text("(Click any node to start sampling algorithm)")
// Draw background
make_temp_gradient_new(0,0,280,400)

// Add Image
image_for_node_2 = svg_2.selectAll(".images")
	.data(plot_data).enter()
	.append('image')
	.attr("class", "energy_min_images")
	.attr("id", function(d,i){return "energy_min_img"+i})
    	.attr('xlink:href', function(d,i){
		return 'scripts_and_figs/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg'})
    	.attr("x", function(d,i){
		return 65})
    	.attr("y", 20)
    	.attr("width", 70)
    	.attr("height", 70)
	.attr("opacity", 0)

d3.select("#energy_min_img0").attr("opacity", 1.0)


line_energy_2 = svg_2.append("path")
    .datum(plot_data) // 10. Binds data to the line
    //.attr("class", "plotline") // Assign a class for styling
    .attr("d", plot_line)
	.style("stroke", c_energy_line)
	.style("stroke-width", stroke_energy_line)
	.style("fill", "none" ); // 11. Calls the line generator

function make_temp_gradient_new(x_pos, y_pos, height, width){
var gradient_temp = svg_2.append("defs")
   .append("linearGradient")
     .attr("id", "gradient_temp")
     .attr("x1", "0%")
     .attr("y1", "0%")
     .attr("x2", "0%")
     .attr("y2", "100%")
     .attr("spreadMethod", "pad");

 gradient_temp.append("stop")
     .attr("offset", temp_grad_offset)
     .attr("stop-color", c2_temp_background)
     .attr("stop-opacity", opacity2_temp_background);

 gradient_temp.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", c1_temp_background)
     .attr("stop-opacity", opacity1_temp_background);


 svg_2.append("rect")
     .attr("width", width)
     .attr("height", height)
     .attr("x", x_pos)
     .attr("y",y_pos)
         .attr("rx", slider_2D_rx)
     .style("fill", "url(#gradient_temp)");
}

// Draw dots
circle_energy_2 = svg_2.selectAll(".dot")
    .data(plot_data)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return x_scale(i) })
    .attr("cy", function(d) { return y_scale(d.y) })
    .attr("r", 4)
    .attr("fill", c_inactive_dot)
    .style("stroke", c_stroke_dot_inactive)
    .attr("id", function(d,i){return "configuration"+i})
    .attr("activity", "inactive")
//      .on("mouseover", function(d,i){
//	      d3.selectAll(".energy_min_images").transition().duration(500).attr("opacity", 0)
//	      d3.select("#energy_min_img"+i).transition().duration(500).attr("opacity", 1.0)
//      })
      .on("click", function(d,i){start_convergence(i, 32, true)})




// The minimas and maximas are hardcoded
min1 = 8
E_max = 16
min2 = 24

function convergence_hopfield(position){
	if(position<E_max){position += Math.sign(min1-position)} 	    //go to min1
	else {  if(position==E_max){ position+= Math.sign(Math.random()-0.5)} // exception for position = max
		else{position += Math.sign(min2-position)} // go to min2
	}
	return position
}

function convergence_inverse_hopfield(position, n){
	// The minimas and maximas are hardcoded
	if (position>0&&position<n-1){
	if(position<E_max){if(position==min1){ position+= Math.sign(Math.random()-0.5) }
			else if(position==E_max){position = position}
			 else {position += Math.sign(-min1+position)}} 	    //go to min1
	else {  	 if(position==min2){ position+= Math.sign(Math.random()-0.5)} // exception for position = max
			else if(position==E_max){position = position}
			 else{position += Math.sign(-min2+position)} // go to min2
	}}
	return position
}

function convergence_boltzmann(position, n){
	Temp = document.getElementById("temperature_slider_energy_minima").innerHTML
	if (Math.exp(-1/Temp)<Math.random()*1.88){
	position = convergence_hopfield(position)}
	else {position = convergence_inverse_hopfield(position, n)}
	return position
}


function draw_red_dot(iterator, pos_list){
	end = pos_list.length
	if(iterator==end){return}
	else {
	a = pos_list[iterator]
	selected_circle = d3.select("#configuration"+a)
	selected_image = d3.select("#energy_min_img"+a)
	d3.selectAll(".energy_min_images").transition().delay(iterator*time_steps_convergence).duration(time_steps_convergence)
			.attr("opacity", 0)
	selected_image.transition().delay(iterator*time_steps_convergence).duration(time_steps_convergence)
			.attr("opacity", 1.0)
	selected_circle.transition().delay(iterator*time_steps_convergence).duration(time_steps_convergence)
			.attr("fill", c_active_dot)
			.style("stroke", c_stroke_dot_active)
			.attr("activity", "active")
			.attr("r", r_active_dot)
			.transition().duration(time_steps_convergence)
			.attr("fill", c_inactive_dot)
			.style("stroke", c_stroke_dot_inactive)
			.attr("activity", "inactive")
			.attr("r", r_inactive_dot);
	iterator += 1
	d3.select("#configuration"+a)
				.on("end", draw_red_dot(iterator, pos_list))
	}
}

function infinite_loop(){
	start_convergence(0, 32, true)
}

function start_convergence(a, number_of_images, boltzmann){
  d3.select("#Temp_Energy_Text_Id").attr("opacity", 0.0)
	d3.selectAll(".dot").interrupt()
			.attr("fill", c_inactive_dot)
			.attr("r", r_inactive_dot).style("stroke", c_stroke_dot_inactive);
	d3.select("#configuration" + a).attr("fill", c_active_dot).attr("r", r_active_dot)
	    .style("stroke", c_stroke_dot_active)
	d3.select(".energy_min_images").interrupt()
	pos_list = [a]
	pos = a
	for(i=1;i<nr_of_steps_per_loop;i++){
   		pos = convergence_boltzmann(pos, number_of_images)
		pos_list.push(pos)}
	draw_red_dot(0, pos_list)
}


function temp_slider_energy_min(val){
	document.getElementById("temperature_slider_energy_minima").innerHTML = x_temp_energy(val).toPrecision(2);
	d3.selectAll(".energy_min_images").interrupt()
	d3.selectAll(".dot").interrupt()
	start_position = 0
	// Find dot with red color
	for(i=0;i<32;i++){
	selected_dot = d3.select("#configuration"+i)
	activity = selected_dot.attr("activity")
	if (activity=="active"){
    if (pos_list.includes(i)){
		  start_position = i}
		}
	}
	start_convergence(start_position, 32, true)
}


function interrupt_convergence(val){
	d3.selectAll(".dot").interrupt()
}
