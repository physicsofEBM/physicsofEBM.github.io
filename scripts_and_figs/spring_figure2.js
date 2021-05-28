const identity_spring2 = "#spring_figure_id2"

// Define SVG Histogram
spring_svg2 = d3.select(identity_spring2)
	.append("svg")
	.attr("id", "fig4_SVG2")
	.attr("x", 0)
	.attr("height", 200)

node1_color = "blue"
node2_color = "red"
node_y_length = 150 //max y pos of 2nd node

spring_svg2.append("line")
	.attr("id", "spring_fig_coupling")
	.attr("x1", center_x_spring)
	.attr("x2", center_x_spring)
	.attr("y1", 20)
	.attr("y2", 100)
	.attr("stroke", "black")
spring_svg2.append("circle")
	.attr("id", "node1")
	.attr("cx", center_x_spring)
	.attr("cy", 20)
	.attr("r", radius_spring_nodes)
	.attr("fill", c_hid_node1)
	.attr("stroke", c_hid_node1_stroke)
spring_svg2.append("circle")
	.attr("id", "node2")
	.attr("cx", center_x_spring)
	.attr("cy", node_y_length)
	.attr("r", radius_spring_nodes)
	.attr("fill", c_hid_node2)
	.attr("stroke", c_hid_node2_stroke)
// Define scales for temp and coupling
var temp_scale = d3.scalePow()
    .exponent(5)
    .domain([0, 100])
    .range([0.1, 100])
    .clamp(true);
var couple_scale = d3.scaleLinear()
    .domain([param_margin_x, param_width+param_margin_x])
    .range([-1, 1])
    .clamp(true);

//function draw_bracket_left(x1, y1, x2, y2){
//x_ch_br = 10
//bracket_height = Math.abs(y1-y2)
//center = y1 + bracket_height/2
// var string = String(x1)+" "+String(y1)+" "+String(x1-x_ch_br)+" "+String(center)+" "+String(x2)+" "+String(y2)
//
// spring_svg2.append("polyline")
//         .attr("class", "bracket")
//         .attr("points", string)
//         .attr("stroke", bracket_color)
//         .attr("stroke-width", bracket_stroke)
//         .attr("stroke-linejoin", "round")
//         .attr("stroke-linecap", "round")
//         .attr("fill", "none")
// }
//function draw_bracket_right(x1, y1, x2, y2){
//x_ch_br = 10
//bracket_height = Math.abs(y1-y2)
//center = y1 + bracket_height/2
// var string = String(x1)+" "+String(y1)+" "+String(x1+x_ch_br)+" "+String(center)+" "+String(x2)+" "+String(y2)
//
// spring_svg2.append("polyline")
//         .attr("class", "bracket")
//         .attr("points", string)
//         .attr("stroke", bracket_color)
//         .attr("stroke-width", bracket_stroke)
//         .attr("stroke-linejoin", "round")
//         .attr("stroke-linecap", "round")
//         .attr("fill", "none")
//return center
// }

//function draw_expectation(x,y, Text_string){
//bracket_color = "black"
//bracket_stroke = 2
//bracket_height = 40
//bracket_width = 40
//bracket_margin = 5
//center = draw_bracket_left(x, y, x, y+bracket_height)
//center = draw_bracket_right(x+bracket_width, y, x+bracket_width, y+bracket_height)
//
//spring_svg2.append("circle")
//	.attr("id", "node1")
//	.attr("cx", x+bracket_margin)
//	.attr("cy", center)
//	.attr("r", 10)
//	.attr("fill", node1_color)
//spring_svg2.append("circle")
//	.attr("id", "node2")
//	.attr("cx", x+bracket_width-bracket_margin)
//	.attr("cy", center)
//	.attr("r", 10)
//	.attr("fill", node2_color)
//spring_svg2.append("text")
//	.text(Text_string)
//	.attr("x", x+bracket_width+6)
//	.attr("y", y+bracket_height)
//}

//draw_expectation(90, 10, "Model")
//draw_expectation(90, 100, "Data")
function draw_arrow_up2(x1, y1, x2, y2){
 spring_svg2.append("line")
                 .attr("class", "up_arrow2")
              .attr("x1",x1)
              .attr("y1",y1)
              .attr("x2",x2)
              .attr("y2",y2)
              .attr("stroke",arrow_color)
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
              .attr("stroke-width",arrow_stroke)

 var string = String(x1-x_change)+" "+String(y1+y_change)+" "+String(x1)+" "+String(y1    )+" "+String(x1+x_change)+" "+String(y1+y_change)

 spring_svg2.append("polyline")
         .attr("class", "up_arrow2")
         .attr("points", string)
         .attr("stroke", arrow_color)
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
         .attr("stroke-width", arrow_stroke)
         .attr("fill", "none")
 }

 function draw_arrow_down2(x1, y1, x2, y2){
 spring_svg2.append("line")
                 .attr("class", "down_arrow2")
              .attr("x1",x1)
              .attr("y1",y1)
              .attr("x2",x2)
              .attr("y2",y2)
              .attr("stroke",arrow_color)
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
              .attr("stroke-width",arrow_stroke)

 var string = String(x2-x_change)+" "+String(y2-y_change)+" "+String(x2)+" "+String(y2    )+" "+String(x2+x_change)+" "+String(y2-y_change)

 spring_svg2.append("polyline")
         .attr("class", "down_arrow2")
         .attr("points", string)
         .attr("stroke", arrow_color)
         .attr("stroke-width", arrow_stroke)
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
         .attr("fill", "none")
 }

function Arrow_Sum2(center_x, center_y, max_length, slider_input){
 min = d3.select("#spring_slider2_id").attr("min")
 max = d3.select("#spring_slider2_id").attr("max")
 mean = (max - min)/2
 diff =  (mean-slider_input)*max_length
 scale = Math.floor((1-Math.abs((slider_input-mean)/(max-mean)))*gradient_steps_spring_fig)
 y2 = center_y - diff
 spring_svg2.append("line")
                 .attr("class", "sum_arrow2")
              .attr("x1",center_x)
              .attr("y1",center_y)
              .attr("x2",center_x)
              .attr("y2",y2)
         .attr("stroke", grad_arrow_sum[scale])
             //.attr("stroke","rgb(0,0,0)")
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
              .attr("stroke-width",arrow_sum_stroke)



 var string_down = String(center_x-x_change)+" "+String(y2-y_change)+" "+String(center_x)+" "+String(y2)+" "+String(center_x+x_change)+" "+String(y2-y_change)
 var string_up = String(center_x-x_change)+" "+String(y2+y_change)+" "+String(center_x)+" "+String(y2)+" "+String(center_x+x_change)+" "+String(y2+y_change)

 if (diff>0){string = string_up}
         else {string = string_down}

 spring_svg2.append("polyline")
         .attr("class", "sum_arrow2")
         .attr("points", string)
         .attr("stroke", grad_arrow_sum[scale])
         .attr("stroke-width", arrow_sum_stroke)
         .attr("stroke-linejoin", "miter")
         .attr("stroke-linecap", "miter")
         .attr("fill", "none")
 }

function draw_spring_ypos2(center_x, center_y, nr_of_kinks, descent){
         y_pos = center_y+spring_start_length
         y_pos = y_pos + descent
         for (i=1; i<=nr_of_kinks; i++){
                 y_pos = y_pos + descent
         }
         y_pos = y_pos + descent/2
         return y_pos + spring_start_length
 }

spring_svg2.append('image')
       .attr('id', 'spring_fig_F_theta')
       .attr('xlink:href', "scripts_and_figs/figures/F_theta.png")
       .attr("x", 110)
       .attr("y", 0)
       .attr("width", 50)
       .attr("height", 35)
       .attr("opacity", 1.0)
spring_svg2.append('image')
       .attr('id', 'spring_fig_Fd')
       .attr('xlink:href', "scripts_and_figs/figures/Fd.png")
       .attr("x", 110)
       .attr("y", 100)
       .attr("width", 50)
       .attr("height", 35)
       .attr("opacity", 1.0)
spring_svg2.append('image')
       .attr('id', 'spring_fig_Fsum2')
       .attr('xlink:href', "scripts_and_figs/figures/F_sum.png")
       .attr("x", 160)
       .attr("y", 77)
       .attr("width", 35)
       .attr("height", 25)
       .attr("opacity", 1.0)

	y_pos_final = draw_spring_ypos2(center_x_spring, y_start, number_of_kinks, spring_descent)

        draw_arrow_down2(x_pos_arrows, 120, x_pos_arrows, 180)
	draw_arrow_up2(x_pos_arrows, y_pos_final-val*100, x_pos_arrows, y_pos_final-margin_between_arrows)

function spring_slider2(value){
	val = (1-value)
	value = value*(1.0)+0.2
	d3.selectAll(".up_arrow2").remove()
	d3.selectAll(".down_arrow2").remove()
	d3.selectAll(".sum_arrow2").remove()
	y_pos= draw_spring_ypos2(center_x_spring, y_start, number_of_kinks, (val+0.1)*spring_descent)
	draw_arrow_down2(x_pos_arrows, y_pos, x_pos_arrows, y_pos+down_arrow_length)
	draw_arrow_up2(x_pos_arrows, 20, x_pos_arrows, y_pos-margin_between_arrows)
	Arrow_Sum2(200, 100, 100, -val+1)
	d3.select("#spring_fig_coupling").attr("stroke-width", value*5)
		.attr("opacity", value)
		.attr("y2", 1.2*y_pos)
	d3.select("#node2").attr("cy", 1.2*y_pos)
	d3.select("#spring_fig_Fd").attr("y", y_pos)
}

spring_slider2(0.0)
