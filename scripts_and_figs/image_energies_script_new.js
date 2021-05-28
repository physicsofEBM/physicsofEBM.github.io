const identity_img_energy = "#image_energies_id"

var margin = {right: 100, left: 50}, // position of slider in color field
    height_img_energies = 450

var svg_imgequil = d3.select(identity_img_energy)
    .append("svg")
    .attr('id', 'main_svg_imag_energy')
    .attr('class','figures')
    .attr("width", "100%")
    .attr("height", height_img_energies);

width_energies_img = document.getElementById("image_energies").clientWidth

var img_width = 20 // This is the size of the image in the svg
    img_height = 20
    img_margin = 10

var distance_hidden = 230 // how far are hidden and visible appart

// Random initial positions
UL_FIG_number_of_images = 42
modulo_of_images = 6 //How many copies with noise are there of each image
x_margin_left = 0
x_margin_right = 20
y_margins = 20
final_y = 400

function init_image_position(){
var UL_FIG_img_nr = [];
for (var i = 0; i < UL_FIG_number_of_images; i++) {
   noise_level = i%modulo_of_images
   x_init = x_margin_left+Math.floor((width_energies_img-x_margin_left-x_margin_right)*Math.random())
   y_init = Math.floor(y_margins + Math.random()*(height_img_energies-2*y_margins))
   y_end = height_img_energies-y_margins - Math.floor((height_img_energies-2*y_margins)/6*noise_level+Math.random()*30)
   UL_FIG_img_nr.push([i,x_init,y_init,y_end ]);
}
return UL_FIG_img_nr}

UL_FIG_img_nr = init_image_position()

function reinitialize_image_energies(){
UL_FIG_img_nr = init_image_position()
d3.selectAll(".img_energy_fig").data(UL_FIG_img_nr).transition().duration(100)
    .attr("x", function(d){return d[1]})
    .attr("y", function(d){return d[2]})
    .attr("ende", function(d){return d[3]})
    .attr("start", function(d){return d[2]})
}

UL_FIG_number_of_steps = 101 // Number of steps from bottom to top
function initialize_image_energies(){
images = svg_imgequil.selectAll()
    .data(UL_FIG_img_nr)
    .enter()
    .append("image")
    .attr("class", "img_energy_fig")
    .attr('xlink:href', function(d){return 'scripts_and_figs/figures/Images_for_energy_vs_epoch/energy_image_'+d[0]+'.jpg'})
    .attr("x", function(d){return d[1]})
    .attr("y", function(d){return d[2]})
    .attr("ende", function(d){return d[3]})
	.attr("start", function(d){return d[2]})
    .attr("width", img_width)
    .attr("height", img_height)
    .attr('id', function(d){return 'energy_image' + d[0]})
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})
    .on("click", function(d){main_image_var = d[0],
                            main_image.attr('xlink:href', 'scripts_and_figs/figures/Images_for_energy_vs_epoch/energy_image_'+ main_image_var+'.jpg')});

}

initialize_image_energies()

// Slider Function
// -------------------------------------------------
number_of_learning_steps = 20
function unlearning_fct_image_energies(h) {
  for (var i = 0; i < UL_FIG_number_of_images; i++) {
	image = d3.select('#energy_image'+i)
      var start_x = image.attr('x')
      var start_y = image.attr('y')
      var end_y = image.attr("ende")
      var y = d3.scaleLinear().domain([0, 2*number_of_learning_steps]).range([start_y, end_y]);
    d3.select('#energy_image'+i).transition().delay(h*step_length).duration(step_length)
                    .attr('x', start_x)
                    .attr('y', y(h))
  }
}

function learning_fct_image_energies(h) {
  good_img_list = [0,6,12,18,24,30,36]
  for (var i=0; i< good_img_list.length; i++) {
	 idx = good_img_list[i]
	image = d3.select('#energy_image'+idx)
      var start_x = image.attr('x')
      var start_y = image.attr('y')
      var end_y = image.attr("ende")
      var y = d3.scaleLinear().domain([0, number_of_learning_steps]).range([start_y, end_y]);
    d3.select('#energy_image'+idx).transition().delay(h*step_length).duration(step_length)
                    .attr('x', start_x)
                    .attr('y', y(h))
  }
}
function move_images_learning(){
	learning_fct_image_energies(UL_FIG_number_of_steps-1)
}
