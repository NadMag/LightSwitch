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

function getImageFileName(sliders, values) {
  let sliders_file_names = [];
  let single_lamp_off_image = values[0] === 0;
  let first_lamp_index = sliders[0].dataset.lamp;
  for (let i = 0; i < sliders.length; ++i) {
    sliders_file_names.push(valueToName(sliders[i], values[i]));
    single_lamp_off_image = single_lamp_off_image && sliders[i].dataset.lamp === first_lamp_index;
  }

  if (single_lamp_off_image)
    return sliders_file_names[0];
  return sliders_file_names.join("_");
}


function getImagePath(slider_group, sliders, values=[]){
    if (values.length === 0)
      values = sliders.map(slider => slider.value);
    values = values.map(value => parseInt(value));
    let image_file_name = getImageFileName(sliders, values);
    return `${String(slider_group.dataset.base)}${String(image_file_name)}.jpg`;
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

export function loadDemo() {
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
        slider.style.border = "2px solid white";
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

    function imgEnter(event) {
        demo_slider_containers.forEach(demo_slider_container => {
        let rect = img.getBoundingClientRect();
        demo_slider_container.style.display = 'block';
        demo_slider_container.style.left = rect.left + img.clientWidth * parseFloat(demo_slider_container.dataset.x) +  'px';
        demo_slider_container.style.top =  window.scrollY + rect.top + img.clientHeight * parseFloat(demo_slider_container.dataset.y) + 'px';
        });
        img.removeEventListener('mouseenter', imgEnter);
    }


    img.addEventListener('mouseenter', imgEnter);

    img.addEventListener('mouseout', (event) =>  {
        let mouse_x = event.clientX;
        let mouse_y = event.clientY;
        let rect = img.getBoundingClientRect();
        if ((mouse_x >= rect.left) && (mouse_x <= rect.left + img.clientWidth) && (mouse_y >= rect.top) && (mouse_y <= rect.top + img.clientHeight))
        return;
        demo_slider_containers.forEach(demo_slider_container => {
        demo_slider_container.style.display = 'none';
        });

        img.addEventListener('mouseenter', imgEnter);
    });

    })
};