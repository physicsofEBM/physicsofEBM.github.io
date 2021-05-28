const RBM_complete_XOR = "#CD_figure1_id" // This defines in which div we write into

var IDENTIFIERXOR = '_XOR'

circle_offset = 50

dictionary["h_units"+IDENTIFIERXOR] = 1
dictionary["v_units"+IDENTIFIERXOR] = 2
dictionary["total_spins"+IDENTIFIERXOR] = 3
dictionary["histogram_data"+IDENTIFIERXOR] = [0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125]
dictionary["hidden_vecs"+IDENTIFIERXOR] = permutations_of_vector(dictionary["h_units"+IDENTIFIERXOR])
dictionary["bm_permutations"+IDENTIFIERXOR] = permutations_of_vector(dictionary["total_spins"+IDENTIFIERXOR])
// Add the space where it draws the RBM

// Define Mouseover tooltip style


d3.select(RBM_complete_XOR)
    .append("svg")
    .attr("id", "CD_algo_main_svg")
	.attr("width", 800)
	.attr("height", 350)


d3.select("#CD_algo_main_svg")
    .append("svg")
    .attr("id", "RBM_sampler"+IDENTIFIERXOR)
    .attr('class','figures')
    //.attr("width", 1000) // use whole space given in article
    //.attr("height", 1000); // This is height of figure without 'selectors'

d3.select("#CD_algo_main_svg")
    .append("svg")
    .attr("id", "RBM_sampler_histo"+IDENTIFIERXOR)
    .attr('class','figures')
    //.attr("width", width) // use whole space given in article
    //.attr("height", 500) // This is height of figure without 'selectors'
	.attr("x", 400)
	.attr("y", 0)

d3.select("#RBM_sampler_histo"+IDENTIFIERXOR).append('image')
      .attr('id', 'teaser_main_img_big_id')
      .attr('xlink:href', "scripts_and_figs/figures/CD_algorithm/histogram_labels4.png")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", 260)
      .attr("opacity", 1.0)


 var magnet_gradient_h = d3.select("#RBM_sampler"+IDENTIFIERXOR).append("defs")
   .append("linearGradient")
     .attr("id", "magnet_gradient_h")
	.attr("gradientTransform", "rotate(90)");

 magnet_gradient_h.append("stop")
     .attr("offset", "0%")
     .attr("stop-color", c1_hidden_bias)
     .attr("stop-opacity", 1.0);

 magnet_gradient_h.append("stop")
     .attr("offset", "50%")
     .attr("stop-color", c2_hidden_bias)
     .attr("stop-opacity", 1.0);

magnet_gradient_h.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", c3_hidden_bias)
     .attr("stop-opacity", 1.0);

 var magnet_gradient_v = d3.select("#RBM_sampler"+IDENTIFIERXOR).append("defs")
   .append("linearGradient")
     .attr("id", "magnet_gradient_v")
	.attr("gradientTransform", "rotate(90)");

 magnet_gradient_v.append("stop")
     .attr("offset", "0%")
     .attr("stop-color", c1_visible_bias)
     .attr("stop-opacity", 1.0);

 magnet_gradient_v.append("stop")
     .attr("offset", "50%")
     .attr("stop-color", c2_visible_bias)
     .attr("stop-opacity", 1.0);

magnet_gradient_v.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", c3_visible_bias)
     .attr("stop-opacity", 1.0);


add_magnetic_field_background(0, 1)
add_magnetic_field_background(1, 1)
add_magnetic_field_background(2, 0)
//add_magnetic_field_background_rect(2)
//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

update_architecture(IDENTIFIERXOR)

dictionary["weight_slider_index"+IDENTIFIERXOR] = 0
dictionary["bias_slider_index"+IDENTIFIERXOR] = 0
//background_rectangles_hidden_visible(IDENTIFIERXOR)

//generate_histogram("histogram_pos_phase",80, IDENTIFIERXOR)
generate_histogram("histogram_neg_phase",80, IDENTIFIERXOR)

generate_RBM_biases_new(IDENTIFIERXOR)
generate_RBM_connections_new(IDENTIFIERXOR)
generate_RBM_nodes_new(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)

dictionary["configuration_to_learn"+IDENTIFIERXOR] = [[1,1,1,],[1,-1,1],[-1,1,-1],[-1,-1,-1],[-1,1,1],[-1,-1,1], [1,-1,-1], [1,1,-1]]
wanted_config = 'red'
unwanted_config = 'blue'


function add_magnetic_field_background(index, v){
if (v==1){url = "url(#magnet_gradient_v)"}
if (v==0 ) { url = "url(#magnet_gradient_h)"}
 d3.select("#RBM_sampler"+IDENTIFIERXOR)
         .append("circle")
         .attr("cx", function(d,i){return pos_gen_x(index,index,IDENTIFIERXOR)})
         .attr("cy", function(d,i){offset = 0
         if(v==1){offset = circle_offset}
         return pos_gen_y(index,index,IDENTIFIERXOR)+offset})
     		.attr("r", magnet_field_radius)
     		.style("fill", url)
		.style("stroke", c_bias_field_stroke);
}


function add_magnetic_field_background_rect(index, field_color){

 d3.select("#RBM_sampler"+IDENTIFIERXOR)
         .append("rect")
         .attr("x", 0)
         .attr("y", 0)
     	.attr("width", width)
	.attr("height", svg_RBM_height)
		.style("fill", "url(#magnet_gradient)");
}



function generate_RBM_nodes_new(identifier){
 // Define tooltips for hovering information

 var colors_init = [c_visible_node1,c_visible_node2, c_hidden_node]
 var color_init_stroke = [c_visible_node1_stroke,c_visible_node2_stroke, c_hidden_node_stroke]
 //var hidden_colors = ['hsl(240, 100%, 84%)', 'hsl(0, 100%, 84%)'];
 //var hidden_colors_stroke = ["blue", "red"]
     // -------------------------------------------------------------------------
     // Draw nodes for the RBM
     // -------------------------------------------------------------------------
     d3.select("#RBM_complete_main_svg"+identifier).selectAll("circle")
         .data(dictionary["spins_data"+identifier])
         .enter()
         .append("circle")
         .style("fill", function(d,i){return colors_init[d]})
         .attr("stroke", function(d,i){return color_init_stroke[d]})
         //.attr('class', 'hidden_circle') // class is needed for style sheet
         .attr("cx", function(d,i){return pos_gen_x(d,i,identifier)})
         .attr("cy", function(d,i){offset=0
         if(i==1){offset = circle_offset}
         if(i==0){offset=circle_offset}
         return pos_gen_y(d,i,identifier)+offset})
         .attr("r", RBM_node_radius)
         .attr('id', function(d,i){return "RBM_node"+d})
         .attr('index', function(d,i){return d})


function change_bias_value(y, index){
    offset=0
	if(index==0){offset=circle_offset}
	if(index==1){offset=circle_offset}
	y_zero = pos_gen_y(index,index,IDENTIFIERXOR) +offset
	if(Math.abs(y-y_zero)>(magnet_field_radius-RBM_node_radius)){
	y = y_zero + Math.sign(y-y_zero)*(magnet_field_radius-RBM_node_radius)}
	bias_value = 1*((y-y_zero)/(magnet_field_radius-RBM_node_radius)).toFixed(1)
	d3.select("#biastext"+index).text(function(){return "bias: "+bias_value})
	return [y,bias_value]
}

 var dragHandler = d3.drag()
    .on("drag", function () {
    	  index = d3.select(this).attr("index")
          ypos = d3.event.y
	  out = change_bias_value(ypos, index)
	    ypos = out[0]
	    bias_value = out[1]
          d3.select(this).attr("cy", ypos);
       dictionary["biases"+identifier][index] = bias_value
	    if (index<2){
   line_w = d3.select("#weight"+index)
	   line_w.attr("y1", ypos)
	    }
            else {
   line_w = d3.select("#weight0")
	   line_w.attr("y2", ypos+RBM_node_radius)
   line_w = d3.select("#weight1")
	   line_w.attr("y2", ypos+RBM_node_radius)}

    })

    .on("end", function () {
          xpos = d3.event.x
          ypos = d3.event.y
    	  index = d3.select(this).attr("index")
	    if (index<2){
		 bias_fct_RBM_new(index, identifier)
		}
	    else {
		 bias_fct_RBM_new(index, identifier)
	    }
    })
    dragHandler(d3.select("#RBM_complete_main_svg"+identifier).selectAll("circle"))
 }



function generate_RBM_connections_new(identifier){
	weight_text = [ "W₁", "W₂" ]
           histo_id1 = "histogram_data_pos_phase"
   d3.select("#RBM_complete_main_svg"+identifier).selectAll("line")
         .data(dictionary["connection_graph"+identifier])
         .enter()
         .append("line")
         .attr("id", function(d, i){return 'weight'+i})
	.attr("index", function(d,i){return i})
         .attr("stroke",c_rbm_connection) //These attr are defined by class
         .attr("stroke-width", rbm_connection_stroke)
	 .attr("opacity", rbm_connection_opacity)
         .attr("x1", function(d){return line_pos_gen_x1(d,identifier)})
         .attr("y1", function(d){return line_pos_gen_y1(d,identifier)+circle_offset})
         .attr("x2", function(d){return line_pos_gen_x2(d,identifier)})
         .attr("y2", function(d){return line_pos_gen_y2(d,identifier)})
         .on("mouseover", function(d,i) {
             tooltip.text(weight_text[i] +' = '+ dictionary["weight_matrix"+identifier][d[0]][d[1]])
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
 }

function bias_fct_RBM_new(index, identifier) {
        var spins_new = dictionary["spins_new"+identifier]
        var bias_slider_index = index
        var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
        var hidden_vecs = dictionary["hidden_vecs"+identifier]
          histogram_data = []
          for (j=0; j<configuration_to_learn.length; j++){
                histogram_data.push(prob_of_config(configuration_to_learn[j], identifier))}
	histo_data_neg = histogram_data
          histo_id2 = "histogram_neg_phase"
          update_histogram(histo_data_neg, histo_id2, identifier) // neg phase
        }

function slider_bias_just_text_new(h,index,identifier) {
        var spins_new = dictionary["spins_new"+identifier]
        var bias_slider_index = index
        dictionary["biases"+identifier][bias_slider_index] = h
        value = document.getElementById("bias_slider_value"+identifier)
        value.innerHTML =  h
        }

function generate_RBM_biases_new(identifier){
     d3.select("#RBM_complete_main_svg"+identifier).selectAll()
         .data(dictionary["spins_data"+identifier])
         .enter()
         .append("text")
         .attr("x",10)
         .attr("y", function(d,i){return 200+i*20+circle_offset})
	.text("bias: 0")
	.attr("class", "general_text")
	.attr("fill", c_text_slider)
	.attr("id", function(d,i){return "biastext"+i})
 }

var RBM_2D_slider_pos_x = 200
var RBM_2D_slider_pos_y = 50
var RBM_2D_slider_width = 100
var RBM_2D_slider_height = 100
var init_pos_x = 250
var init_pos_y = 100

var RBM_gradient = d3.select("#RBM_sampler"+IDENTIFIERXOR).append("defs")
  .append("linearGradient")
    .attr("id", "RBM_gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

RBM_gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", c2_2D_slider)
    .attr("stop-opacity", 1.0);

RBM_gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", c1_2D_slider)
    .attr("stop-opacity", 1.0);

d3.select("#RBM_sampler"+IDENTIFIERXOR).append("rect")
    .attr("width", RBM_2D_slider_width)
    .attr("height", RBM_2D_slider_height)
    .attr("x", RBM_2D_slider_pos_x)
    .attr("y",RBM_2D_slider_pos_y)
    .attr("rx", slider_2D_rx)
    .style("fill", "url(#RBM_gradient)");

d3.select("#RBM_sampler"+IDENTIFIERXOR).append("line")
	.attr("id", "RBM_weight_line1")
	.attr("x1", RBM_2D_slider_pos_x)
	.attr("x2", RBM_2D_slider_pos_x+RBM_2D_slider_width)
	.attr("y1", init_pos_y)
	.attr("y2", init_pos_y)
	.style("stroke", c_stroke_2D_slider)
d3.select("#RBM_sampler"+IDENTIFIERXOR).append("line")
	.attr("id", "RBM_weight_line2")
	.attr("x1", init_pos_x)
	.attr("x2", init_pos_x)
	.attr("y1", RBM_2D_slider_pos_y)
	.attr("y2", RBM_2D_slider_pos_y + RBM_2D_slider_height)
	.style("stroke", c_stroke_2D_slider)
d3.select("#RBM_sampler"+IDENTIFIERXOR).append("circle")
	.attr("class", "RBM_2D_slider")
       .attr("cx", init_pos_x)
      .attr("cy", init_pos_y)
      .attr("r", handle_2D_slider_radius)
      .attr("fill", c_handle_2D_slider)
	.attr("stroke", c_stroke_2D_slider)

d3.select("#RBM_sampler"+IDENTIFIERXOR).append("text")
	.text(function(){return "W₂="+0.0.toFixed(1)})
	.attr("id", "RBM_text_weight1")
     	.attr("class", "general_text")
	.attr("x", RBM_2D_slider_pos_x+RBM_2D_slider_width)
	.attr("y", init_pos_y)
    	.style("fill", c_text_slider)

d3.select("#RBM_sampler"+IDENTIFIERXOR).append("text")
	.text(function(){return "W₁="+ 0.0.toFixed(1)})
	.attr("id", "RBM_text_weight2")
	.attr("class", "general_text")
	.attr("x", init_pos_x)
	.attr("y", RBM_2D_slider_pos_y)
    	.style("fill", c_text_slider)


var dragHandler_slider = d3.drag()
    .on("drag", function () {
	xpos = d3.event.x
	ypos = d3.event.y
	if (xpos<RBM_2D_slider_pos_x){xpos = RBM_2D_slider_pos_x}
	if (xpos>RBM_2D_slider_width+RBM_2D_slider_pos_x){xpos=RBM_2D_slider_width+RBM_2D_slider_pos_x}
	if (ypos<RBM_2D_slider_pos_y){ypos = RBM_2D_slider_pos_y}
	if (ypos>RBM_2D_slider_height+RBM_2D_slider_pos_y){ypos=RBM_2D_slider_height+RBM_2D_slider_pos_y}
	twoD_slider_RBM(xpos,ypos)
        d3.select(this)
            .attr("cx", xpos)
            .attr("cy", ypos);
    });

dragHandler_slider(d3.select("#RBM_sampler"+IDENTIFIERXOR).selectAll(".RBM_2D_slider"));

function RBM_twoD_pos_to_weight(xpos, ypos){
	x = 2*(xpos - RBM_2D_slider_pos_x - RBM_2D_slider_width/2)/RBM_2D_slider_width
	y = 2*(ypos - RBM_2D_slider_pos_y - RBM_2D_slider_height/2)/RBM_2D_slider_height
	return [x, y]

}

function twoD_slider_RBM(xpos, ypos) {
  	identifier = IDENTIFIERXOR
	d3.select("#RBM_weight_line1").attr("y1", ypos).attr("y2", ypos)
	d3.select("#RBM_weight_line2").attr("x1", xpos).attr("x2", xpos)
	d3.select("#RBM_text_weight1").attr("y", ypos+10)
	d3.select("#RBM_text_weight2").attr("x", xpos-param_margin_x)
	Weights_RBM = RBM_twoD_pos_to_weight(xpos, ypos)
	weight_1 = Weights_RBM[0]
	weight_2 = Weights_RBM[1]
		d3.select("#RBM_text_weight2").text(function(){return "W₂="+ weight_1.toFixed(1)})
		d3.select("#RBM_text_weight1").text(function(){return "W₁="+ weight_2.toFixed(1)})

	  var connection_graph = dictionary["connection_graph"+identifier]
          var weight_matrix = dictionary["weight_matrix"+identifier]
          var spins_new = dictionary["spins_new"+identifier]
          var weight_slider_index = dictionary["weight_slider_index"+identifier]
          var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
          var hidden_vecs = dictionary["hidden_vecs"+identifier]
          idx1 = connection_graph[weight_slider_index][0]
          idx2 = connection_graph[weight_slider_index][1]
          weight_matrix[0][2] = weight_1.toFixed(1)
	  weight_matrix[1][2] = weight_2.toFixed(1)
          //value = document.getElementById("weight_slider_value"+identifier)
          //value.innerHTML =  weight_1
          //d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
          histogram_data = []
          for (j=0; j<configuration_to_learn.length; j++){
                histogram_data.push(prob_of_config(configuration_to_learn[j], identifier))}
          histo_data_neg = histogram_data
          //histo_data_pos = histo_pos_phase(histogram_data)
          //histo_id1 = "histogram_pos_phase"
          histo_id2 = "histogram_neg_phase"
          //update_histogram(histo_data_pos, histo_id1, identifier) // pos phase
          update_histogram(histo_data_neg, histo_id2, identifier) // neg phase
}
