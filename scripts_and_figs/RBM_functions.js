const RBM_complete = "#RBM_complete_id" // This defines in which div we write into

var IDENTIFIER = ''

// How to read out checkbox values
//var select_hidden = document.getElementById("hidden_check"+IDENTIFIER)
//var select_restricted = document.getElementById("restricted_check"+IDENTIFIER)

dictionary = {}
//select_hidden.checked = false
//var hidden_active = select_hidden.checked // Initialize selectors
//var restricted_active = select_restricted.checked


// Default Variables
dictionary["h_units"+IDENTIFIER] = 1
dictionary["v_units"+IDENTIFIER] = 2
dictionary["total_spins"+IDENTIFIER] = 3
dictionary["hidden_vecs"+IDENTIFIER] = permutations_of_vector(dictionary["h_units"+IDENTIFIER])
dictionary["bm_permutations"+IDENTIFIER] = permutations_of_vector(dictionary["total_spins"+IDENTIFIER])
var width = 500;
var svg_RBM_height = 200;
var svg_histo_height = 280;
var space = 13.0
//var histo_x_pos = 50
var histo_label_x_pos = 10
var histo_width = 18
var histo_height = 200
var histo_y_pos = 10

var center_x = 100;
var center_y = 110;
var scaling = 50

var margin_x = 10

//var colors = ['white', 'black'];
//var hidden_colors = ['hsl(240, 100%, 84%)', 'hsl(0, 100%, 84%)'];
//var hidden_colors_stroke = ["blue", "red"]
//var nodes_colors = [colors,hidden_colors, colors]
//var stroke_colors = [["black", "black"], hidden_colors_stroke, ["black", "black"]]
//var ypos1 = 50
//var ypos2 = 200


var tooltip = d3.select("body") //This is in body not svg
  .append("div")
  .attr('class', 'tooltip');


function update_architecture(identifier){
	var h_units = dictionary["h_units"+identifier]
	var v_units = dictionary["v_units"+identifier]
	var total_spins = dictionary["total_spins"+identifier]
	all_connections = make_connection_new(identifier)
	dictionary["connection_graph"+identifier] = all_connections[0]
	dictionary["weight_matrix"+identifier] = all_connections[1]
	var spins_data = []
	var spins_new = []
	var biases = []
	for (var i = 0; i < total_spins; i++) {
	    spins_data.push(i);
	    spins_new.push(-1); 
	    biases.push(0);	
	}
	dictionary["biases"+identifier] = biases
	dictionary["spins_data"+identifier] = spins_data
	dictionary["spins_new"+identifier] = spins_new

	d3.select("#RBM_sampler"+identifier).append("svg")
			.attr("id", "RBM_complete_main_svg"+identifier)

}

function generate_histogram(histo_id, histo_x_pos, identifier){
var histogram_data = dictionary["histogram_data"+identifier] 

var x_histogram = d3.scaleLinear()
          .range([0, 100]);
var y_histogram = d3.scaleLinear()
		.domain([0,0.5])
          .range([100, 0]);

var histogram_svg = d3.select("#RBM_sampler_histo"+identifier).append("g")

// append the bar rectangles to the svg element
histogram_svg.selectAll("rect")
	.data(histogram_data)
	.enter().append("rect")
	.style("fill", c_histo_bars_RBM)
	.style("opacity", 1.0)
	.attr("id", function(d,i){return histo_id+identifier+i})
	.attr("x", histo_x_pos) // margin left
	.attr("y", function(d,i){return histo_pos_gen(i)}) // margin left
	.attr("rx", histo_rx_RBM)
	.attr("width", function(d,i) { return d*histo_height ; })
	.attr("height", function(d) { return histo_width; });
  y_pos_histo_axis = histo_pos_gen(0)-20;
  x_pos_histo_axis = histo_y_pos;
  
  histogram_svg.append("g")
        .call(d3.axisLeft(y_histogram))
        .attr("transform", function(){return  "translate("+y_pos_histo_axis+"," + x_pos_histo_axis + ")";})
}

// =============================================================================
// =============================================================================
// DEFINE ALL FUNCTIONS
// =============================================================================


// -----------------------------------------------------------------------------
// General Connection Matrix function
// -----------------------------------------------------------------------------
function make_connection_new(identifier){
	var h_units = dictionary["h_units"+identifier]
	var v_units = dictionary["v_units"+identifier]
	var total_spins = dictionary["total_spins"+identifier]
	var total_nodes = total_spins
	stringer = "hidden_check"+identifier
	if (hidden_active== false){
		total_nodes = total_spins - h_units
	}
	var weight_matrix = []
	var connection_graph = []
	// Initialize connection Data
    	for(var j=0; j< total_nodes; j++) {
		row = Array(total_nodes).fill(0.0);
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
// Update function for selectors hidden active and restricted active
// -----------------------------------------------------------------------------
function update_select(){
	hidden_activate = sel_hid_active.property('value')
	restricted_activate = sel_rest_active.property("value")
};

// -----------------------------------------------------------------------------
// Functions for position generation for nodes and weights
// -----------------------------------------------------------------------------
function pos_gen_x(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = Math.PI/6 + 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x
};


function pos_gen_x_rect(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = Math.PI/6 + 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x+20
};

function pos_gen_y(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = Math.PI/6 + 2*Math.PI/total_spins*i
	y = Math.sin(angle)*scaling + center_y
	return y
};

// The input data here is the connection_graph [[0,1],[0,2],...[5,6]]
function line_pos_gen_x1(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 = Math.PI/6 + 2*Math.PI/total_spins*d[0]
	x_1 = Math.cos(angle_1)*(scaling-RBM_node_radius) + center_x
	return Math.round(x_1)
};

function line_pos_gen_x2(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_2 =  Math.PI/6 + 2*Math.PI/total_spins*d[1]
	x_2 = Math.cos(angle_2)*(scaling-RBM_node_radius) + center_x
	return Math.round(x_2)};

function line_pos_gen_y1(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 =  Math.PI/6 + 2*Math.PI/total_spins*d[0]
	y_1 = Math.sin(angle_1)*(scaling-RBM_node_radius) + center_y
	return Math.round(y_1)
};

function line_pos_gen_y2(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_2 =  Math.PI/6 + 2*Math.PI/total_spins*d[1]
	y_2 = Math.sin(angle_2)*(scaling-RBM_node_radius) + center_y
	return Math.round(y_2)
};

 // -------------------------------------------------------------------------
 // Draw lines for the RBM 
 // -------------------------------------------------------------------------
function generate_RBM_connections(identifier){ 
	  histo_id1 = "histogram_data_pos_phase"
   d3.select("#RBM_sampler"+identifier).selectAll()
        .data(dictionary["connection_graph"+identifier])
        .enter()
        .append("line")
        .attr("id", function(d){return 'weight_h'+identifier + d[0] + '' + d[1]})
        .attr("stroke","rgb(0,0,0,0.5)") //These attr are defined by class
        .attr("stroke-width", 4.0)
        .attr("x1", function(d){return line_pos_gen_x1(d,identifier)})
        .attr("y1", function(d){return line_pos_gen_y1(d,identifier)})
        .attr("x2", function(d){return line_pos_gen_x2(d,identifier)})
        .attr("y2", function(d){return line_pos_gen_y2(d,identifier)})
        .on("mouseover", function(d) {
            tooltip.text('Coupling:' + d[0] +',' + d[1]+ ' Strength: '+ dictionary["weight_matrix"+identifier][d[0]][d[1]])
                    .style("visibility", "visible")
         d3.select(this).attr("stroke","rgb(0,0,0,1.0)")           ;
      })
  
       .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY+10)+ "px")
            .style("left", event.pageX+10 + "px")
            d3.select(this).attr("stroke","rgb(0,0,0,1.0)");
      })
  
      .on("mouseout", function() {tooltip.style("visibility", "hidden")
      d3.select(this).attr("stroke","rgb(0,0,0,0.5)");
      })
      .on("click", function(d){
               line = d3.select(this)
                   coupling = d
               index = dictionary["connection_graph"+identifier].indexOf(coupling)
                   var idx1 = dictionary["connection_graph"+identifier][index][0]	
                   var idx2 = dictionary["connection_graph"+identifier][index][1]	    
                   arg = dictionary["weight_matrix"+identifier][idx1][idx2]
	           document.getElementById("weight_slider_id"+identifier).value = arg
               //text = d3.select("#weighttext")
               //text.text(function(){return "Weight: ("+ idx1+', ' + idx2+')'})
	      text = document.getElementById("weight_slider_text"+identifier)
	      text.innerHTML =  "Weight: ("+ idx1+", "+idx2+")"	
	      value = document.getElementById("weight_slider_value"+identifier)
	      value.innerHTML =  arg	
               dictionary["weight_slider_index"+identifier] = index
      })	
} 
// -----------------------------------------------------------------------------
// EVERYTHING ABOUT PROBABILITIES OF BM
// -----------------------------------------------------------------------------

// ============================================================================
// Here we calculate the probabilities of the configurations
// ============================================================================
function energy_fct(spins_vec, identifier){
	var total_spins = dictionary["total_spins"+identifier]
	var connection_graph = dictionary["connection_graph"+identifier]
	var biases = dictionary["biases"+identifier]
	var energy = 0
	var order=[0,2,1]
	for (var i = 0; i<connection_graph.length; i++){
		kk = connection_graph[i][0]
		ll = connection_graph[i][1]
		energy += spins_vec[kk]*spins_vec[ll]*dictionary["weight_matrix"+identifier][kk][ll]
		}	
	for (var j = 0; j<total_spins; j++){
		energy+= spins_vec[j]*biases[order[j]]}	
        return energy
};

// =============================================================================
// WRITE a proper permutation function
// =============================================================================
// Function to define length of string
function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
};

function permutations_of_vector(vector_length){
    all_permutations = []
    for (i=0; i<2**vector_length; i++){
        var binary_string = FormatNumberLength(Number(i).toString(2), vector_length);
        (arr = []).length = vector_length; 
        arr.fill(-1);
        for (j=0; j<binary_string.length; j++){
            var res = binary_string.charAt(j)
            if (res == 1){
            arr[j] = 1
            }};
        all_permutations.push(arr)
    } return all_permutations
}

// =============================================================================
// Partition function
// =============================================================================
function part_fct(all_permuts, identifier){  
     var Z = 0
    for (var i = 0; i<all_permuts.length; i++) {
        energy_Z = energy_fct(all_permuts[i], identifier)
        Z += Math.exp(-energy_Z)
        }
        return Z
}

// =============================================================================
// Calc all configurations given a single visible
// =============================================================================
function all_configs_given_v(single_visible, hidden_permutations){
    all_permutations = []
    for (var k = 0; k<hidden_permutations.length; k++){
            all_permutations.push([single_visible, hidden_permutations[k]].flat())
    }
    return all_permutations
}

// =============================================================================
// calculate probability of given visible configuration
// =============================================================================
function prob_of_v(single_visible, hidden_permutations, identifier){
    var bm_permutations = dictionary["bm_permutations"+identifier]
    Z = part_fct(bm_permutations, identifier)
    boltzmann_factor = 0
    all_conf = all_configs_given_v(single_visible, hidden_permutations)
    for (var a = 0; a<all_conf.length; a++) {
        energy_v = energy_fct(all_conf[a], identifier) 
        boltzmann_factor += Math.exp(-energy_v)
        };
    return (boltzmann_factor/Z)    
}

function prob_of_config(config, identifier){
    var bm_permutations = dictionary["configuration_to_learn"+identifier]
    Z = part_fct(bm_permutations, identifier)
    boltzmann_factor = 0
        energy_v = energy_fct(config, identifier) 
        boltzmann_factor += Math.exp(-energy_v)
    return (boltzmann_factor/Z)    
}

// =============================================================================
// This function calculates probability of single visible (index) to be 1
// =============================================================================
function p_individual_v(index, visible_permutations, hidden_permutations, identifier){
    prob = 0
    conjugate = 0
    for (var i = 0; i<visible_permutations.length; i++) {
        if (visible_permutations[i][index] == 1){
        prob += prob_of_v(visible_permutations[i],  hidden_permutations, identifier)
        }
        else { // this is only to test if conj + prob add up to 1
            conjugate += prob_of_v(visible_permutations[i],  hidden_permutations, identifier)
        }
}
return prob
}

// =============================================================================
// returns the individual probabilities of visible units to be 1
// =============================================================================
//function p_total_v(visible_vecs, hidden_vecs, identifier){
//    var v_units = dictionary["v_units"+identifier]
//    all_probs = []
//    for (i=0; i<v_units; i++){
//        all_probs.push(p_individual_v(i, visible_vecs, hidden_vecs))
//    }
//    return all_probs
//    }
//
// -------------------------------------------------------------------------
// Weight and Bias TEXT
// -------------------------------------------------------------------------
//var slider_RBM_dist = d3.select("#RBM_sampler").append("g")

function add_text_elements(identifier){
	var weight_slider_index = dictionary["weight_slider_index"+identifier]
	var bias_slider_index = dictionary["bias_slider_index"+identifier]
	var connection_graph = dictionary["connection_graph"+identifier]
	var biases = dictionary["biases"+identifier]	
}



// -------------------------------------------------------------------------
// Slider Function
// -------------------------------------------------------------------------

//function slider_bias_fct_RBM(h, identifier) {
//	var spins_new = dictionary["spins_new"+identifier]
//	var bias_slider_index = dictionary["bias_slider_index"+identifier]
//	var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
//	var hidden_vecs = dictionary["hidden_vecs"+identifier]
//       dictionary["biases"+identifier][bias_slider_index] = h
//	value = document.getElementById("bias_slider_value"+identifier)
//	value.innerHTML =  h
//        d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
//	  histogram_data = []  
//	  for (j=0; j<configuration_to_learn.length; j++){
//	  	histogram_data.push(prob_of_config(configuration_to_learn[j], identifier))}
//	  histo_data_neg = histogram_data
//	  histo_data_pos = histo_pos_phase(histogram_data)
//	  histo_id1 = "histogram_pos_phase"
//	  histo_id2 = "histogram_neg_phase"
//          update_histogram(histo_data_pos, histo_id1, identifier) // pos phase         
//          update_histogram(histo_data_neg, histo_id2, identifier) // neg phase          
//        }
//
//function slider_bias_just_text(h,identifier) {
//	var spins_new = dictionary["spins_new"+identifier]
//	var bias_slider_index = dictionary["bias_slider_index"+identifier]
//        dictionary["biases"+identifier][bias_slider_index] = h
//	value = document.getElementById("bias_slider_value"+identifier)
//	value.innerHTML =  h	
//        d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
//        }
//
//function slider_fct_RBM(h,identifier) {
//	  var connection_graph = dictionary["connection_graph"+identifier]
//	  var weight_matrix = dictionary["weight_matrix"+identifier]
//	  var spins_new = dictionary["spins_new"+identifier]
//	  var weight_slider_index = dictionary["weight_slider_index"+identifier]
//	  var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
//	  var hidden_vecs = dictionary["hidden_vecs"+identifier]
//          idx1 = connection_graph[weight_slider_index][0]	
//          idx2 = connection_graph[weight_slider_index][1]	    
//          weight_matrix[idx1][idx2] = h 
//	  value = document.getElementById("weight_slider_value"+identifier)
//	  value.innerHTML =  h	
//          d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
//	  histogram_data = []  
//	  for (j=0; j<configuration_to_learn.length; j++){
//	  	histogram_data.push(prob_of_config(configuration_to_learn[j], identifier))}
//	  histo_data_neg = histogram_data
//	  histo_data_pos = histo_pos_phase(histogram_data)
//	  histo_id1 = "histogram_pos_phase"
//	  histo_id2 = "histogram_neg_phase"
//          update_histogram(histo_data_pos, histo_id1, identifier) // pos phase         
//          update_histogram(histo_data_neg, histo_id2, identifier) // neg phase          
//        } 


const add = (a, b) => a + b

function histo_pos_phase(histogram_data){
new_data = histogram_data.slice(0,4)
normalization_const = new_data.reduce(add)
renormalize = new_data.map(function(element) {
	return element/normalization_const;
});
for (j=0; j<4; j++){renormalize.push(0)}	
return renormalize	
}
// =============================================================================
// Histogram functions
// =============================================================================

function histo_pos_gen(d) {
    return margin_x + d*(histo_width+space);
};

function update_histogram(histogram_data, histo_id, identifier){
    for (i=0; i<histogram_data.length; i++) {
        d3.select("#"+histo_id+identifier+i).attr("width", function(){return histogram_data[i]*histo_height})
                            //.attr("y", function(){return histo_y_pos-100+(1-histogram_data[i])*histo_height}) 
    }
}

