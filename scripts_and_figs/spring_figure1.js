const identity_spring = "#spring_figure_id1"

// Define SVG Histogram
spring_svg = d3.select(identity_spring)
	.append("svg")
	.attr("id", "fig4_SVG")
	.attr("x", 0)
	.attr("height", 200)


function draw_arrow_up(x1, y1, x2, y2){
spring_svg.append("line")
		.attr("class", "up_arrow")
             .attr("x1",x1)
             .attr("y1",y1)
             .attr("x2",x2)
             .attr("y2",y2)
             .attr("stroke",arrow_color)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
             .attr("stroke-width",arrow_stroke)

var string = String(x1-x_change)+" "+String(y1+y_change)+" "+String(x1)+" "+String(y1)+" "+String(x1+x_change)+" "+String(y1+y_change)

spring_svg.append("polyline")
	.attr("class", "up_arrow")
	.attr("points", string)
	.attr("stroke", arrow_color)
	.attr("stroke-linejoin", "miter")
	.attr("stroke-linecap", "miter")
	.attr("stroke-width", arrow_stroke)
	.attr("fill", "none")
}

function draw_arrow_down(x1, y1, x2, y2){
spring_svg.append("line")
		.attr("class", "down_arrow")
             .attr("x1",x1)
             .attr("y1",y1)
             .attr("x2",x2)
             .attr("y2",y2)
             .attr("stroke",arrow_color)
	.attr("stroke-linejoin", "miter")
	.attr("stroke-linecap", "miter")
             .attr("stroke-width",arrow_stroke)

var string = String(x2-x_change)+" "+String(y2-y_change)+" "+String(x2)+" "+String(y2)+" "+String(x2+x_change)+" "+String(y2-y_change)

spring_svg.append("polyline")
	.attr("class", "down_arrow")
	.attr("points", string)
	.attr("stroke", arrow_color)
	.attr("stroke-width", arrow_stroke)
	.attr("stroke-linejoin", "miter")
	.attr("stroke-linecap", "miter")
	.attr("fill", "none")
}


function Arrow_Sum(center_x, center_y, max_length, slider_input){
min = d3.select("#spring_slider1_id").attr("min")
max = d3.select("#spring_slider1_id").attr("max")
mean = (max - min)/2
diff = 	(mean-slider_input)*max_length
scale = Math.floor((1-Math.abs((slider_input-mean)/(max-mean)))*gradient_steps_spring_fig)
y2 = center_y - diff
spring_svg.append("line")
		.attr("class", "sum_arrow")
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

spring_svg.append("polyline")
	.attr("class", "sum_arrow")
	.attr("points", string)
	.attr("stroke", grad_arrow_sum[scale])
	.attr("stroke-width", arrow_sum_stroke)
	.attr("stroke-linejoin", "miter")
	.attr("stroke-linecap", "miter")
	.attr("fill", "none")
}

function draw_spring_new(center_x, center_y, width,  nr_of_kinks, descent){
	var pos_string = String(center_x)+" "+String(center_y)+" "+String(center_x)
	y_pos = center_y+spring_start_length
	pos_string = pos_string + " "+String(y_pos)
	y_pos = y_pos + descent
	x_pos = center_x + width/2
	pos_string = pos_string + " "+String(x_pos)
	pos_string = pos_string + " "+String(y_pos)
	for (i=1; i<=nr_of_kinks; i++){
		x_pos = x_pos + (-1)**i*width
		y_pos = y_pos + descent
		pos_string = pos_string + " "+String(x_pos)
		pos_string = pos_string + " "+String(y_pos)
	}
	y_pos = y_pos + descent/2
	pos_string = pos_string + " "+String(center_x)
	pos_string = pos_string + " "+String(y_pos)
	pos_string = pos_string + " "+String(center_x)
	pos_string = pos_string + " "+String(y_pos+spring_start_length)
	spring_svg.append("polyline")
		.attr("class", "down_arrow")
		.attr("points", pos_string)
		.attr("stroke", spring_color)
		.attr("stroke-width", spring_stroke)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("fill", "none")
	return y_pos + spring_start_length
}

x_change = 10
y_change = 10
x_pos_arrows = 100
down_arrow_length = 62
margin_between_arrows = 15

draw_arrow_up(x_pos_arrows, 10, x_pos_arrows, 100)
draw_arrow_down(x_pos_arrows, 120, x_pos_arrows, 180)

center_x_spring = 50
y_start = 0
spring_width = 40
number_of_kinks = 8
spring_descent = 9

y_pos_final = draw_spring_new(center_x_spring, y_start, spring_width, number_of_kinks, spring_descent)

rect_height = 40
rect_width = 40

spring_svg.append("rect")
	.attr("id", "spring_weight")
	.attr("x", center_x_spring-rect_width/2)
	.attr("y", y_pos_final)
	.attr("rx", 4)
	.attr("height", rect_height)
	.attr("width", rect_width)
	.attr("fill", weight_color)
	.attr("stroke", weight_color_stroke)
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

spring_svg.append('image')
       .attr('id', 'spring_fig_Fy')
       .attr('xlink:href', "scripts_and_figs/figures/Fy.png")
       .attr("x", 110)
       .attr("y", 0)
       .attr("width", 50)
       .attr("height", 35)
       .attr("opacity", 1.0)
spring_svg.append('image')
       .attr('id', 'spring_fig_Fg')
       .attr('xlink:href', "scripts_and_figs/figures/Fg.png")
       .attr("x", 110)
       .attr("y", 100)
       .attr("width", 50)
       .attr("height", 35)
       .attr("opacity", 1.0)
spring_svg.append('image')
       .attr('id', 'spring_fig_Fsum1')
       .attr('xlink:href', "scripts_and_figs/figures/F_sum.png")
       .attr("x", 160)
       .attr("y", 77)
       .attr("width", 35)
       .attr("height", 25)
       .attr("opacity", 1.0)

function spring_slider(value){
	val = (1-value)
	d3.selectAll(".spring_line").remove()
	d3.selectAll(".down_arrow").remove()
	d3.selectAll(".up_arrow").remove()
	d3.selectAll(".sum_arrow").remove()
	y_pos_final = draw_spring_new(center_x_spring, y_start, spring_width, number_of_kinks, (val+0.1)*spring_descent)
	d3.select("#spring_fig_Fg").attr("y", y_pos_final)
	draw_arrow_down(x_pos_arrows, y_pos_final, x_pos_arrows, y_pos_final+down_arrow_length)
	draw_arrow_up(x_pos_arrows, 20, x_pos_arrows, y_pos_final-margin_between_arrows)
	d3.select("#spring_weight").attr("y", y_pos_final)
	Arrow_Sum(200, 100, 100, value)
}

spring_slider(0.0)
