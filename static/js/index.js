window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 3000,
    };

    // // Debugging: Check if #results-carousel has items
    // console.log('Checking #results-carousel...');
    // const resultsItems = $('#results-carousel .item');
    // if (resultsItems.length > 0) {
    //     console.log('#results-carousel has items:', resultsItems.length);
    //     var resultsCarousel = bulmaCarousel.attach('#results-carousel', options);
    //     resultsCarousel.forEach(carousel => {
    //         carousel.on('before:show', state => {
    //             console.log('Results Carousel state:', state);
    //         });
    //     });
    // } else {
    //     console.warn('No items found in #results-carousel. Skipping initialization.');
    // }
  
    // // Debugging: Check if #visible-carousel has items
    // console.log('Checking #visible-carousel...');
    // const visibleItems = $('#visible-carousel .item');
    // if (visibleItems.length > 0) {
    //     console.log('#visible-carousel has items:', visibleItems.length);
    //     var visibleCarousel = bulmaCarousel.attach('#visible-carousel', options);
    //     visibleCarousel.forEach(carousel => {
    //         carousel.on('before:show', state => {
    //             console.log('Visible Carousel state:', state);
    //         });
    //     });
    // } else {
    //     console.warn('No items found in #visible-carousel. Skipping initialization.');
    // }

    // Prevent carousel from intercepting slider interactions
    $('.slider').on('mousedown touchstart', function(event) {
        event.stopPropagation();
    });

    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    loadDemo();

})

// Demo
const demo_colors = ["#f06", "#f4d", "#94f", "#09f", "#7c3", "#fe0", "#fb0"]
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
const demo_range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);


function valueToName(slider, value){
  if (slider.dataset.type === "color")
    return `${String(value)}`;
  let multiplier = parseInt(slider.dataset.multiplier);
  return `${String(value * multiplier).padStart(3, '0')}`;
  // return `${String(slider_group.dataset.base)}${String(value * multiplier).padStart(3, '0')}`;
}

function getImageFileName(sliders, values, example_name="") {
  let sliders_file_names = [];
  let single_lamp_off_image = values[0] === 0;
  let first_lamp_index = sliders[0].dataset.lamp;
  for (let i = 0; i < sliders.length; ++i) {
    sliders_file_names.push(valueToName(sliders[i], values[i]));
    single_lamp_off_image = single_lamp_off_image && sliders[i].dataset.lamp === first_lamp_index;
  }
  if (example_name == "example_lego_jazzclub") {
    sliders_file_names.push("009");
  }


  if (single_lamp_off_image)
    return sliders_file_names[0];
  return sliders_file_names.join("_");
}


function getImagePath(slider_group, sliders, values=[]){
    if (values.length === 0)
      values = sliders.map(slider => slider.value);
    values = values.map(value => parseInt(value));
    example_path = String(slider_group.dataset.base)
    example_name = example_path.split("/").slice(-2,-1)[0];
    let image_file_name = getImageFileName(sliders, values, example_name);
    return `${example_path}${String(image_file_name)}.jpg`;
}


function pre_load_images(slider_group, sliders) {
  let all_values = sliders.map(slider=>demo_range(parseInt(slider.min), parseInt(slider.max)));
  let values_prod;
  if (sliders.length === 1)
    values_prod = all_values[0].map(value => [value]);
  else
    values_prod = cartesian(...all_values);
  values_prod.forEach(values =>
  {
    let img = new Image();
    img.style.display = "none";
    document.body.appendChild(img);
    img.src = getImagePath(slider_group, sliders, values);
  })
}

function loadDemo() {
    const images = document.querySelectorAll('.demo_img');
    const sliderGroups = document.querySelectorAll('.slider_group');
    sliderGroups.forEach((slider_group, group_index) => {

    let img = images[group_index];
    let demo_slider_containers_raw = slider_group.children;
    let sliders = [];
    let demo_slider_containers = []
    for (let i = 0; i < demo_slider_containers_raw.length; ++i){
        sliders.push(demo_slider_containers_raw[i].children[0]);
        demo_slider_containers.push(demo_slider_containers_raw[i]);
    }
    pre_load_images(slider_group, sliders);
    sliders.forEach(slider => {
        if (slider.dataset.type === "power"){
        slider.style.height = 20 + "px";
        slider.style.border_color = "white";
        slider.style.background = "transparent";
        slider.style.setProperty('--SliderColor', "white")
        }
        else{
        slider.style.setProperty('--SliderColor', demo_colors[slider.value])
        }
    });

    sliders.forEach(slider => {
        slider.addEventListener("input", function () {
        if (slider.dataset.type === "color")
            slider.style.setProperty('--SliderColor', demo_colors[slider.value])
        img.src = getImagePath(slider_group, sliders);
        });
    });
    demo_slider_containers.forEach(demo_slider_container => {
      // rect = demo_slider_container.parentElement.parentElement.getElementsByTagName('img')[0].getBoundingClientRect();
      // height = rect.height;
      // width = rect.width;
      // demo_slider_container.style.width = width + 'px';
      // demo_slider_container.style.height = height + 'px';
      demo_slider_container.style.display = 'block';
      demo_slider_container.style.left = parseFloat(demo_slider_container.dataset.x)*100 +  '%';
      demo_slider_container.style.top =  parseFloat(demo_slider_container.dataset.y)*100 + '%';
    });

    function imgEnter(event) {
        demo_slider_containers.forEach(demo_slider_container => {
        let rect = img.getBoundingClientRect();
        demo_slider_container.style.display = 'block';
        demo_slider_container.style.left = parseFloat(demo_slider_container.dataset.x)*100 +  '%';
        demo_slider_container.style.top =  parseFloat(demo_slider_container.dataset.y)*100 + '%';
        });
        img.removeEventListener('mouseenter', imgEnter);
    }

    function imgExit(event) {
        let mouse_x = event.clientX;
        let mouse_y = event.clientY;
        let rect = img.getBoundingClientRect();
        if ((mouse_x >= rect.left) && (mouse_x <= rect.left + img.clientWidth) && (mouse_y >= rect.top) && (mouse_y <= rect.top + img.clientHeight))
        return;
        demo_slider_containers.forEach(demo_slider_container => {
        demo_slider_container.style.display = 'none';
        });

        img.addEventListener('mouseenter', imgEnter);
    };

    // img.addEventListener('mouseenter', imgEnter);
    // img.addEventListener('mouseout', imgExit);
});

};
