var Hopfield_id = "#architecture_Hopfield_id" // This defines in which div we write into
var RBM_id = "#architecture_RBM_id"
var BM_id = "#architecture_BM_id"

var hidden_nodes_colors = [c_hid_node1, c_hid_node2]
var visible_nodes_colors = [c_vis_node1, c_vis_node2]
var hidden_nodes_stroke_colors = [c_hid_node1_stroke, c_hid_node2_stroke]
var visible_nodes_stroke_colors = [c_vis_node1_stroke, c_vis_node2_stroke]


function toggle_colors_architecture(selection, d){
        spins = [1,1,1,1,1,1,1,1]
        selection_id = selection.attr('id')
        id = selection_id.slice(0,-1)
        selection = d3.select("#"+id + "0")
        sel_Fig_id  = selection.attr("Figure_id")
        index_list = [0,1,2,3,4,6,7]
        if(sel_Fig_id == "Hopfield_figure"){
          index_list = [0,1,2,3]
        }
        for(i in index_list){
          d = index_list[i]
          selection = d3.select("#"+id + d)
         if(d>3){
	 	//         if(selection_id=="hiddenHopfield_figure"+d){
    //           console.log("hidden")
		// }
		//  else {
       state = switch_color(selection, hidden_nodes_colors, hidden_nodes_stroke_colors)
       spins[d] = state
     // }
	 }
	else {
        state = switch_color(selection, visible_nodes_colors, visible_nodes_stroke_colors)
        spins[d] = state
        }
}
return spins
}

function switch_color(selection, nodes_color, stroke_color, sel_Fig_id){
	 current_state = selection.attr("node_state")
	 if(current_state==0){current_state=1}
	 else{current_state=0}
         selection.transition()
	 selection.style("stroke", stroke_color[current_state])
   selection.style("fill", nodes_color[current_state])
	 selection.attr("node_state", current_state)
   return current_state
}

graph_weights = []
for(var i=0;i<8;i++){
  graph_weights[i] = []
  for(var j=0;j<8;j++){
    graph_weights[i][j] = 5*(Math.random()-1/2).toFixed(5)
  }

}

function get_energy(spins, connection_graph){
  energy = 0
  for (var i = 0; i<connection_graph.length; i++){
		kk = connection_graph[i][0]
		ll = connection_graph[i][1]
		energy += 2*(spins[kk]-1/2)*(spins[ll]-1/2)*2*graph_weights[kk][ll]
		}
    return energy.toFixed(2)
}

// Default Variables
var h_units = 4
var v_units = 4
var total_spins = h_units + v_units

var width = 700;
var height = 230;
var radius = nodes_radius;
var space = 70.0

var center_x = 100;
var center_y = (height / 2);

var margin_x = 0.0
// Scaling for the positioning functions. Changes size of graph
var scaling_architecture = 80

SVG_id = "#architecture_Hopfield_id"
Figure_id = "Hopfield_figure"
hidden_active = false
restricted_active = false


Run_for_given_ID()


SVG_id = "#architecture_BM_id"
Figure_id = "BM_figure"
hidden_active = true
restricted_active = false


Run_for_given_ID()

SVG_id = "#architecture_RBM_id"
Figure_id = "RBM_figure"
hidden_active = true
restricted_active = true


Run_for_given_ID()


function Run_for_given_ID(){


// Add the space where it draws the RBM
var svg_Figure = d3.select(SVG_id)
    .append("svg")
    .attr("id", Figure_id)
    .attr('class','figures')
    .attr("width", "100%") // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

var all_connections, connection_graph, weight_matrix, spins_data, spins_new, biases, nodes_svg, visible_svg, weight_select_svg, energy_text


function generate_figure(){
all_connections = make_connection_new()
connection_graph = all_connections[0]
weight_matrix = all_connections[1]

spins_data = []
spins_new = []
biases = []
for (var i = 0; i < total_spins; i++) {
    spins_data.push(i);
    if(i<4){
    spins_new.push((Math.pow(-1, i)+1)/2)}
    else{spins_new.push(1)}
    biases.push(-1);
}

nodes_svg = svg_Figure.append("svg")
visible_svg = svg_Figure.append("svg")
weight_select_svg = svg_Figure.append("svg")


// Generate the actual graph
generate_RBM_figure()
}

generate_figure()

// =============================================================================
// =============================================================================
// DEFINE ALL FUNCTIONS
// =============================================================================


// -----------------------------------------------------------------------------
// General Connection Matrix function
// -----------------------------------------------------------------------------
function make_connection_new(){
	total_nodes = total_spins
	if (hidden_active== false){
		total_nodes = total_spins - h_units
	}
	var weight_matrix = []
	var connection_graph = []
	// Initialize connection Data
    	for(var j=0; j< total_nodes; j++) {
		row = Array(total_nodes).fill(-1.0);
        	weight_matrix.push(row);
		for (i=0; i< total_nodes; i++){
			if (j>=i){}
			else{
			     if(restricted_active==false){
		    	       connection_graph.push([j,i])}
			     else{
                               if((j<v_units && i<v_units)||(j>=v_units && i>=v_units)){}
			       else{connection_graph.push([j,i])} }
			}
		}};

	// Connection graph has to be adapted as well
	if(restricted_active){
		for(var j=0; j< v_units; j++) {
    			for(var i=0; i< v_units; i++) {
			weight_matrix[j][i] = 0;}

		}
		for(var j=v_units; j< h_units + v_units; j++) {
    			for(var i=v_units; i< h_units + v_units; i++) {
        		weight_matrix[j][i] = 0}
	}
}
return [connection_graph, weight_matrix]};


// -----------------------------------------------------------------------------
// Functions for position generation for nodes and weights
// -----------------------------------------------------------------------------
function pos_gen_x(d,i){
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling_architecture + center_x
	return x
};


function pos_gen_x_rect(d,i){
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling_architecture + center_x
	return x+20
};

function pos_gen_y(d,i){
	angle = 2*Math.PI/total_spins*i
	y = Math.sin(angle)*scaling_architecture + center_y
	return y
};

// The input data here is the connection_graph [[0,1],[0,2],...[5,6]]
function line_pos_gen_x1(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_1 = Math.cos(angle_1)*(scaling_architecture-radius) + center_x
	return Math.round(x_1)
};

function line_pos_gen_x2(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_2 = Math.cos(angle_2)*(scaling_architecture-radius) + center_x
	return Math.round(x_2)};

function line_pos_gen_y1(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_1 = Math.sin(angle_1)*(scaling_architecture-radius) + center_y
	return Math.round(y_1)
};

function line_pos_gen_y2(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_2 = Math.sin(angle_2)*(scaling_architecture-radius) + center_y
	return Math.round(y_2)
};

// =============================================================================
// Genearte the RBM Graph
// =============================================================================
lc_N = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉']
vh = ["v", "h"]

function generate_RBM_figure(){

// Define tooltips for hovering information
var tooltip = d3.select("body") //This is in body not svg
  .append("div")
  .attr('class', 'tooltip');


tooltip.style("color", c_text_tooltip)
	.style("background-color", c_background_tooltip)
	.style("font-size", "14px")

    d3.select("#"+Figure_id).append("text")
    .text(function(){return "Energy =" + get_energy(spins_new, connection_graph)})
    .attr("id", Figure_id+"_energy_text")
    .attr("x", 10)
    .attr("y", 10)
    .attr("class", "general_text")
    .attr("fill", c_text_slider)
    // -------------------------------------------------------------------------
    // Draw lines for the RBM
    // -------------------------------------------------------------------------
    d3.select("#"+Figure_id).selectAll()
        .data(connection_graph)
        .enter()
        .append("line")
        .attr("id", function(d){return 'weight_h' + d[0] + '' + d[1]})
    //     .attr("class", "RBM_line")
        .attr("stroke", c_architecture_connection) //These attr are defined by class
        .attr("stroke-width", connection_stroke_width)
        .attr("x1", line_pos_gen_x1)
        .attr("y1", line_pos_gen_y1)
        .attr("x2", line_pos_gen_x2)
        .attr("y2", line_pos_gen_y2)
        .on("mouseover", function(d,i) {
            tooltip.text( "w" + lc_N[d[0]] + lc_N[d[1]] +"="+graph_weights[d[0]][d[1]].toFixed(2))
                    .style("visibility", "visible")
         d3.select(this).attr("stroke", c_mouseover_rbm_connection).attr("opacity", rbm_connection_mousover_opacity)           ;
      })

       .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY+10)+ "px")
            .style("left", event.pageX+10 + "px")
            d3.select(this).attr("stroke",c_mouseover_rbm_connection).attr("opacity", rbm_connection_mousover_opacity);
      })

      .on("mouseout", function() {tooltip.style("visibility", "hidden")
      d3.select(this).attr("stroke",c_rbm_connection).attr("opacity", rbm_connection_opacity);
      })
    // -------------------------------------------------------------------------
    // Draw nodes for the RBM
    // -------------------------------------------------------------------------
    nodes_svg.selectAll("circle")
        .data(spins_new)
        .enter()
        .append("circle")
        .style("fill", function(d,i){
		if (hidden_active==true && i>=v_units){
			return hidden_nodes_colors[d]
		}
		else {return visible_nodes_colors[d]}})
        .style("stroke", function(d,i){
		if (hidden_active==true && i>=v_units){
			return hidden_nodes_stroke_colors[d]
		}
		else {return visible_nodes_stroke_colors[d]}})
	.style("stroke-width", nodes_stroke_width)
	.attr("node_state", function(d,i){return d})
        .attr('class', 'visible_circle') // class is needed for style sheet
        .attr("cx", pos_gen_x)
        .attr("cy", pos_gen_y)
        .attr("r", radius)
        .attr("Figure_id", Figure_id)
        .attr('id', function(d,i){return "hidden"+Figure_id+i})
	.on("click", function(d,i){
    if (hidden_active==true){
    spins_new = toggle_colors_architecture(d3.select(this), i)
    tooltip.text( function(){return vh[Math.floor(i/v_units)] + lc_N[i] +"="+ -2*(spins_new[i]-0.5) })
  }
  id = d3.select(this).attr("Figure_id")
  d3.select("#"+id+ "_energy_text").text(function(){return "Energy =" + get_energy(spins_new, connection_graph)})
  })
  .on("mouseover", function(d,i) {
      tooltip.text( function(){return vh[Math.floor(i/v_units)] + lc_N[i] +"="+ -2*(spins_new[i]-0.5) })
              .style("visibility", "visible")
   d3.select(this).attr("stroke", c_mouseover_rbm_connection).attr("opacity", rbm_connection_mousover_opacity)           ;
})

 .on("mousemove", function(d) {
      tooltip.style("top", (event.pageY+10)+ "px")
      .style("left", event.pageX+10 + "px")
      d3.select(this).attr("stroke",c_mouseover_rbm_connection).attr("opacity", rbm_connection_mousover_opacity);
})

.on("mouseout", function() {tooltip.style("visibility", "hidden")
d3.select(this).attr("stroke",c_rbm_connection).attr("opacity", rbm_connection_opacity);
})
//if (hidden_active==true){
//for (j=v_units; j<v_units+h_units; j++){
//	d3.select("#hidden"+Figure_id+j)
//	.attr("class", "hidden_circle")
//	.style("fill", hidden_nodes_colors[0])
//        .style("stroke", hidden_nodes_colors[0])}
//}
//
if (hidden_active==false){
for (j=v_units; j<v_units+h_units; j++){
	d3.select("#hidden"+Figure_id+j)
	.attr("class", "unused_circle")
	// .style("fill", c_unused_nodes)
  .style("fill", "white")
	.style("stroke", unused_nodes_stroke)
	.style("stroke-dasharray","5,4")
  .style("stroke-width", 2.0)
	.on("click", function(d,i){return})
  .on("mouseover", function(d,i) {
  })


}
}

    }
}
