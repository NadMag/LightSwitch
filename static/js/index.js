window.HELP_IMPROVE_VIDEOJS = false;


// $(document).ready(function() {
//     setupOverlayCarousel();
//     let i = 0;
//     const loadDemoGenerator = loadDemo();
//     // const _ = loadDemoGenerator.next();
//     //console.log('Loaded demo 0');
//     for await (const _ of loadDemoGenerator) {
//       console.log('Loaded demo ' + i);
//       i++;
//     }
//     setupVirtualPointlight();
//     console.log('Loaded virtual pointlight');
// })

document.addEventListener("DOMContentLoaded", async function(event) { 
  await setupOverlayCarousel();
  let i = 0;
  const loadDemoGenerator = loadDemo();
  // const _ = loadDemoGenerator.next();
  //console.log('Loaded demo 0');
  for await (const _ of loadDemoGenerator) {
    console.log('Loaded demo ' + i);
    i++;
    if (i === 1) {
      await setupVirtualPointlight();
    }
  }
  // setupVirtualPointlight();
  console.log('Loaded virtual pointlight');
});

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
  
    for (let values of values_prod) {
    let img = new Image();
    // img.loading = "lazy";
    img.style.display = "none";
    document.body.appendChild(img);
    img.src = getImagePath(slider_group, sliders, values);
  }
}

async function loadSingleDemoExample(slider_group, img) {
  let demo_slider_containers_raw = slider_group.children;
  let sliders = [];
  let demo_slider_containers = []
  for (let i = 0; i < demo_slider_containers_raw.length; ++i){
      sliders.push(demo_slider_containers_raw[i].children[0]);
      demo_slider_containers.push(demo_slider_containers_raw[i]);
  }
  pre_load_images(slider_group, sliders);
  for (let slider of sliders) {
    if (slider.dataset.type === "power"){
    slider.style.height = 25 + "px";
    slider.style.border_color = "white";
    slider.style.background = "transparent";
    slider.style.setProperty('--SliderColor', "white")
    }
    else{
    slider.style.setProperty('--SliderColor', demo_colors[slider.value])
    }
    slider.addEventListener("input", function () {
      if (slider.dataset.type === "color")
          slider.style.setProperty('--SliderColor', demo_colors[slider.value])
      img.src = getImagePath(slider_group, sliders);
    });
  };
  demo_slider_containers.forEach(demo_slider_container => {
    demo_slider_container.style.display = 'block';
    demo_slider_container.style.left = parseFloat(demo_slider_container.dataset.x)*100 +  '%';
    demo_slider_container.style.top =  parseFloat(demo_slider_container.dataset.y)*100 + '%';
  });
}

async function* loadDemo() {
  const images = document.querySelectorAll('.demo_img');
  const sliderGroups = document.querySelectorAll('.slider_group');
  // Add the overlay over the demo
  const demoOverlay = document.querySelector('.demo-overlay');
  demoOverlay.addEventListener('click', () => {
    demoOverlay.style.display = 'none';
  });

  for (let [group_index, slider_group] of sliderGroups.entries()) {
    const img = images[group_index];
    yield loadSingleDemoExample(slider_group, img);
  };
};


async function setupOverlayCarousel() {
  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  }
  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('#results-carousel', options);
  // Loop on each carousel initialized
  for(var i = 0; i < carousels.length; i++) {
    // Add listener to  event
    carousels[i].on('before:show', state => {
      console.log(state);
    });
  }
  // Access to bulmaCarousel instance of an element
  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    // bulmaCarousel instance is available as element.bulmaCarousel
    element.bulmaCarousel.on('before-show', function(state) {
      console.log(state);
    });
  }

  // Prevent carousel from intercepting slider interactions
  $('.slider').on('mousedown touchstart', function(event) {
      event.stopPropagation();
  });
  // --- Mouse Event Handlers for Overlay ---
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
      const overlay = item.querySelector('.carousel-overlay');
      const sourceImage = item.querySelector('img');
      loadOverlay(overlay);
      item.addEventListener('mousedown', () => {
          overlay.classList.add('active');
          sourceImage.classList.add('inactive');
      });

      item.addEventListener('touchstart', () => {
        overlay.classList.add('active');
        sourceImage.classList.add('inactive');
      });

      //  Mouseup *anywhere* should hide the overlay (including outside the item).
      document.addEventListener('mouseup', () => {  // Use document
          overlay.classList.remove('active');
          sourceImage.classList.remove('inactive');
      });

      document.addEventListener('touchend', () => {  // Use document
        overlay.classList.remove('active');
        sourceImage.classList.remove('inactive');
      });

      document.addEventListener('touchcancel', () => {  // Use document
        overlay.classList.remove('active');
        sourceImage.classList.remove('inactive');
      });


    // Prevent dragging of images (important for better UX)
    item.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
    });
  });
}


async function setupVirtualPointlight() {
  const images = [];
  const containers = document.getElementsByClassName('virtual-container');
  for (let container of containers) {
    const sourceDir = container.dataset.sourceDir;
    const mainImage = container.getElementsByClassName('mainImage')[0];
    const defaultImage = mainImage.src;
    const buttons = container.querySelectorAll('.overlay-button');
    const sliders = container.getElementsByClassName('vir_demo_slider');
    if (sliders.length > 0) {
      sliders[0].addEventListener("input", function () {
        mainImage.src = sourceDir + String(sliders[0].value).padStart(3, '0') + "_" + "cond.jpg";
      });
      for (let value in [0, 1, 2]) {
        const img = new Image();
        // img.loading = "lazy";
        // images.push(img);
        img.style.display = "none";
        document.body.appendChild(img);
        img.src = sourceDir + String(value).padStart(3, '0') + "_" + "cond.jpg";
      };
    }
    for (let button of buttons) {
      button.style.left = (parseFloat(button.dataset.x) * 100) + '%';
      button.style.top = (parseFloat(button.dataset.y) * 100) + '%';
      const imgName = button.dataset.imgName;
      const imagePath = sourceDir + imgName;
      if (sliders.length > 0) {
        for (let value in [0, 1, 2]) {
          const curName = String(value).padStart(3, '0') + "_" + button.dataset.imgName;
          const img = new Image();
          // img.loading = "lazy";
          // images.push(img);
          img.style.display = "none";
          document.body.appendChild(img);
          img.src = sourceDir + curName;
        }
      }
      else {
        const img = new Image();
        // img.loading = "lazy";
        // images.push(img);
        img.style.display = "none";
        document.body.appendChild(img);
        img.src = imagePath;
        console.log("Pushed " + imagePath);
      }
    
      //Unified Event Handlers
      const handleStart = (event) => {
        if (sliders.length > 0) {
          let sliderValue = sliders[0].value;
          const curName = String(sliderValue).padStart(3, '0') + "_" + button.dataset.imgName;
          mainImage.src = sourceDir + curName;
        }
        else {
          mainImage.src = imagePath;
        }
        // Hide other buttons
        for (let otherButton of buttons) {
          if (otherButton !== event.currentTarget) { // Check if it's NOT the clicked button
            // otherButton.classList.add('hidden');
            otherButton.style.display = 'none';
          }
        };
      };
    
      const handleEnd = (event) => {
        if (sliders.length > 0) {
          let sliderValue = sliders[0].value;
          const curName = String(sliderValue).padStart(3, '0') + "_" + "cond.jpg";
          mainImage.src = sourceDir + curName;
        } else {
          mainImage.src = defaultImage;
        }
        // Show all buttons again
        for (let button of buttons) {
          if (button !== event.currentTarget) {
            // button.classList.remove('hidden');
            button.style.display = 'block';
          }
        };
      };
    
      // Mouse events (for desktop)
      button.addEventListener('mousedown', handleStart);
      button.addEventListener('mouseup', handleEnd);
      button.addEventListener('mouseleave', handleEnd);
    
      // Touch events (for mobile)
      button.addEventListener('touchstart', handleStart, { passive: true });
      button.addEventListener('touchend', handleEnd);
      button.addEventListener('touchcancel', handleEnd);
    
      button.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
    
      button.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
    };
  };
}

async function loadOverlay(overlayDiv) {
  const img = new Image();
  img.src = overlayDiv.dataset.src;
  overlayDiv.appendChild(img);
}

async function loadOverlayCarousel() {
  // const overlays = document.getElementsByClassName('carousel-overlay');
  overlays = [document.getElementById('nadav')];
  for (let overlay of overlays) {
    loadOverlay(overlay);
  };
}