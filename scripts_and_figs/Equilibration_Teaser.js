const identity_img_teaser = "#Equilibration_Img_Teaser"

var width = 800
    height = 300

var teaser_svg_imgequil = d3.select(identity_img_teaser)
    .append("svg")
    .attr('id', 'teaser_main_svg_imag_equil')
    .attr('class','figures')
    .attr("width", width)
    .attr("height", height);

var img_width = 80 // This is the size of the image in the svg
    img_height = 80
    img_margin = 10

var main_img_width = 128
    main_img_height = 128

var compressed_size = 10,
    canvas_width = 10,
    canvas_height = 20,
    neuron_margin_x = 20,
    neuron_radius = 10;

var distance_hidden = 230 // how far are hidden and visible appart

var teaser_total_equilibration_steps = 1
var max_equilibration_steps = 16
// ----------------------------------------------------

var colors = [c_vis_node1, c_vis_node2];
var stroke_colors_visible = [c_vis_node1_stroke, c_vis_node2_stroke]
var hidden_colors = [c_hid_node1, c_hid_node2];
var hidden_colors_stroke = [c_hid_node1_stroke, c_hid_node2_stroke]
var initialize_flag = false

img_nr = [0,1,2,3,4,6]
number_of_images = [0,1,2] // So far we onl have zero, one, nine

// ADD A SINGLE IMAGE
var teaser_main_image_var = img_nr[0] // define variable globaly
var folder_path = 'scripts_and_figs/figures/images_for_equilibration/'
var folder_nr = ['zero/', 'four/', 'nine/']
var images_visible = ['damaged_zeros_visible_','damaged_fours_visible_','damaged_nines_visible_']

// Add IMAGES to the left
teaser_images = teaser_svg_imgequil.selectAll()
    .data(number_of_images)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return folder_path +folder_nr[d]+images_visible[d] +0+'.jpg'})
    .attr("x", 0)
    .attr("y", function(d,i){return img_width*i + img_margin*i})
    .attr("width", img_width)
    .attr("height", img_height)
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})
    .on("click", function(d,i){teaser_main_image_var = d,
	        teaser_total_equilibration_steps = 1
	        teaser_selected_number = i
          teaser_update_energy_line(i, teaser_total_equilibration_steps)
                teaser_single_step()
    		});


// Define Containers for nodes and Energy Figure
var hidden_container = teaser_svg_imgequil.append("svg")
    .attr("x", 350)
    .attr("y", 0)
    .attr("width", 500)
    .attr("height", 500)
    .attr('id','teaser_HiddenContainer');

var NN_container = teaser_svg_imgequil.append("svg")
    .attr("x", 120)
    .attr("y", 0)
    .attr("width", 500)
    .attr("height", 800)
    .attr('id','teaser_NNContainer');

var teaser_Energy_Plot_Container = teaser_svg_imgequil.append("svg")
    .attr("x", 550)
    .attr("y", 50)
    .attr("width", 200)
    .attr("height", 200)
    .attr('id','teaser_Energy_Container')
// -----------------------------------------------------------------------------

function getwholeImage_N(digit_index, visible) {
	if (digit_index==0){
	if (visible==true){
	raw_data = zeros_visible[Math.ceil(teaser_total_equilibration_steps/2)-1]}
	else {raw_data = zeros_hidden[Math.floor(teaser_total_equilibration_steps/2)]
	}
	}
	if (digit_index==1){
	if (visible==true){
	raw_data = fours_visible[Math.ceil(teaser_total_equilibration_steps/2)-1]}
	else {raw_data = fours_hidden[Math.floor(teaser_total_equilibration_steps/2)]
	}
	}
	if (digit_index==2){
	if (visible==true){
	raw_data = nines_visible[Math.ceil(teaser_total_equilibration_steps/2)-1]}
	else {raw_data = nines_hidden[Math.floor(teaser_total_equilibration_steps/2)]
	}
	}
var points = [];
  for (var s=0; s<compressed_size*compressed_size; s++){
  	x = s % compressed_size,
        y = Math.floor(s/compressed_size),
	c = raw_data[s],
	points.push([x,y,c]) ;
  }
  return points}

function teaser_equilibration_step_rbm(){
	if (teaser_total_equilibration_steps < max_equilibration_steps){
	teaser_total_equilibration_steps += 1
	teaser_initialize_NN()
	}
}

teaser_selected_number = 0

function teaser_update_drawing(delay_time, transition_time) {
points = getwholeImage_N(teaser_selected_number, true)
hidden_points = getwholeImage_N(teaser_selected_number, false)
    if (initialize_flag){
        d3.selectAll(".teaser_weightline1")
	    .transition()
	    .duration(100)
            .attr('stroke', c_weight_lines_active)
	    .attr('opacity', '0.1')
	    .transition()
            .delay(delay_time).duration(transition_time)
            .attr('stroke', c_weight_lines_inactive)
	    .attr('opacity', '0.1')

	d3.selectAll(".teaser_visible_units_circles")
            .data(points)
	    .transition()
	    .delay(delay_time).duration(transition_time)
            .style("fill", function(d) { return colors[d[2]] });

	d3.select("#Teaser_Text_id").attr("opacity", 0.0)
   if (teaser_total_equilibration_steps%2 == 1 ){
    	d3.selectAll('.teaser_equilibrationcircles')
	   	.attr("opacity", 0.05)
	        .transition().delay(delay_time).duration(transition_time)
            	.attr('cx', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            	.attr('cy', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
	    }
   else {d3.selectAll('.teaser_equilibrationcircles')
	        .transition().delay(delay_time).duration(transition_time)
            	.attr('cx', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            	.attr('cy', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
	        .transition().delay(delay_time).duration(transition_time/2).attr("opacity", 0.0)
	   }

        d3.select("#teaser_HiddenContainer").selectAll("circle")
	.data(hidden_points)
        .transition()
        .delay(delay_time).duration(transition_time)
        .style("fill", function(d) { return hidden_colors[d[2]]})
	.style("stroke", function(d){return hidden_colors_stroke[d[2]]})
       d3.select("#teaser_circle_energy_equilibration").transition()
        .delay(delay_time).duration(transition_time)
		    .attr("cx", x_scale_eq_plot(teaser_total_equilibration_steps-1) )
    		.attr("cy", y_scale_eq_plot(teaser_plot_eq_energy_data[teaser_total_equilibration_steps-1].y))
    		.attr("r", 4)
    }
    else{ // This is for the first run

   // Add lines for connection
    d3.select("#teaser_NNContainer").selectAll()
            .data(points)
            .enter()
            .append("line")
	    .attr("class", "teaser_weightline1")
            .attr('x1', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            .attr('x2', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            .attr('y2', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', c_weight_lines_inactive)
            .attr('opacity', opacity_weight)
    // Lines for lower nodes
    d3.select("#teaser_NNContainer").selectAll()
            .data(points)
            .enter()
            .append("circle")
	    .attr("class", "teaser_equilibrationcircles")
            .attr('cx', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            .attr('cy', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            .attr('fill', c_equi_circle)
	    .attr('r', 8)
            .attr('opacity', opacity_equi_circle)
    // Add visible nodes
   d3.select("#teaser_NNContainer").selectAll()
        .data(points)
        .enter()
        .append("circle")
	.attr("class", "teaser_visible_units_circles")
	.attr("cx", 5)
	.attr("cy", 5)
        .style("fill", function(d) { return colors[d[2]]})
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0] - 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)
        .attr("stroke", c_vis_node1_stroke)
        initialize_flag = true

       // Add hidden nodes
    d3.select("#teaser_HiddenContainer").selectAll()
        .data(hidden_points)
        .enter()
        .append("circle")
        .attr("class", "teaser_hidden_nodes")
	.attr("cx", 5)
	.attr("cy", 5)
        .style("fill", function(d) { return hidden_colors[d[2]]})
	.style("stroke", c_hid_node1_stroke)
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0]- 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)

     d3.select("#teaser_NNContainer").append("rect")
	    .attr("x", 0)
	    .attr("y", -5)
	    .attr("width", 175)
	    .attr("height", 200)
	    .attr("opacity", 0.0)
	    .attr("transform", "rotate(18), skewX(18)")
	    .on("click", function(){teaser_equilibration_step_rbm()})
     d3.select("#teaser_NNContainer").append("rect")
	    .attr("x", 240)
	    .attr("y", -75)
	    .attr("width", 175)
	    .attr("height", 200)
	    .attr("opacity", 0.0)
	    .attr("transform", "rotate(18), skewX(18)")
	    .on("click", function(){teaser_equilibration_step_rbm()})
     d3.select("#teaser_NNContainer").append("text")
	    .attr("id", "Teaser_Text_id")
	    .attr("class", "annotation")
	    .attr("x", 100)
	    .attr("y", 270)
	    .text("(Click on nodes to equilibrate)")
        }
}


function teaser_initialize_NN() {
	for (idx=0; idx<max_equilibration_steps;idx++){
    teaser_update_drawing(teaser_time_steps*idx, teaser_time_steps)
	teaser_total_equilibration_steps += 1}
}

function teaser_single_step(){
	teaser_update_drawing(0, teaser_time_steps)
}

teaser_update_drawing(0, 0, 0) //init drawing

// Append Energy Curve
// The number of datapoints for the graph
var number_of_steps = max_equilibration_steps*2;
// The number of actual points for images
var n_points = 6;
var margin_energy_plot = 10

// 5. X scale will use the index of our data
var x_scale_eq_plot = d3.scaleLinear()
    .domain([0, number_of_steps-1]) // input
    .range([margin_energy_plot, teaser_Energy_Plot_Container.attr("width")-2*margin_energy_plot]); // output

// 6. Y scale will use the randomly generate number
var y_scale_eq_plot = d3.scaleLinear()
    .domain([0, 1]) // input
    .range([teaser_Energy_Plot_Container.attr("height")-2*margin_energy_plot, margin_energy_plot]); // output

// 7. d3's line generator
var plot_eq_energy_line = d3.line()
    .x(function(d, i) { return x_scale_eq_plot(i); }) // set the x values for the line generator
    .y(function(d) { return y_scale_eq_plot(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var teaser_plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.4*Math.cos(d/number_of_steps*Math.PI*2)+0.45 } })

energy_plot_frame = teaser_Energy_Plot_Container.append("rect")
	.attr("x", 2*strokewidth_eq_plot)
	.attr("y", 2*strokewidth_eq_plot)
	.attr("rx", 20)
    	.attr("ry", 20)
	.attr("width", teaser_Energy_Plot_Container.attr("width")-20)
	.attr("height", teaser_Energy_Plot_Container.attr("height")-20)
	.attr("fill", "none")
	.attr("stroke-width", strokewidth_eq_plot)
        .attr("stroke", c_energy_plot_frame)
	.attr("stroke-opacity", opacity_energy_plot_frame);

line_energy_2 = teaser_Energy_Plot_Container.append("path")
  .attr("id", "teaser_energy_line_path")
    .datum(teaser_plot_eq_energy_data) // 10. Binds data to the line
    .attr("class", "plotline") // Assign a class for styling
    .attr("d", plot_eq_energy_line)
	.style("stroke", c_energy_curve)

teaser_circle_energy_equilbration = teaser_Energy_Plot_Container.append("circle") // Uses the enter().append() method
    //.attr("class", "dot") // Assign a class for styling
    .attr("id", "teaser_circle_energy_equilibration")
    .attr("cx", x_scale_eq_plot(teaser_total_equilibration_steps) )
    .attr("cy", y_scale_eq_plot(teaser_plot_eq_energy_data[teaser_total_equilibration_steps].y))
    .attr("r", 4)
    .attr("fill", c_energy_position_dot)
    .attr("opacity", 1.0)

function teaser_update_energy_line(i){
      if (i==0){
      teaser_plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.4*Math.cos(d/number_of_steps*Math.PI*2)+0.45 } })
    }
    if (i==1){
      teaser_plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.4*Math.cos(d/number_of_steps*Math.PI*2) +0.1*Math.sin(d/number_of_steps*Math.PI*8-Math.PI/3) +0.5 } })
    }
    if (i==2){
      teaser_plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.8*Math.cos(d/number_of_steps*Math.PI+Math.PI/2) + 0.1*Math.cos(d/number_of_steps*Math.PI*10)  +0.9 } })
    }
    d3.select("#teaser_energy_line_path").datum(teaser_plot_eq_energy_data)
    .attr("d", plot_eq_energy_line)

    d3.select("#teaser_circle_energy_equilibration")
    .attr("cx", x_scale_eq_plot(total_equilibration_steps) )
    .attr("cy", y_scale_eq_plot(teaser_plot_eq_energy_data[total_equilibration_steps].y))

    }
