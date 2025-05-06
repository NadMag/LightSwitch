# LightLab: Controlling Light Sources in Images with Diffusion Models

<p align="center">
<img src="./static/images/teaser_v6.png" width="800px"/>
</p>

*NeuralSVG generates vector graphics from text prompts with ordered and editable shapes. Our method supports dynamic conditioning, such as background color, which facilitating the generation of multiple color palettes for a single learned representation.*

#### Nadav Magar, Amir Hertz, Eric Tabellion, Yael Pritch, Alex Rav-Acha, Ariel Shamir, Yedid Hoshen*

> Controlling light sources in an image is a fundamental aspect of photography that affects the subject, depth separation, colors, and mood of the image. Existing relighting methods either rely on multiple input views to perform inverse rendering at inference time, or fail to provide explicit control.

We present a diffusion-based method for fine-grained, parametric control over light sources from a single image. Our method can change the intensity and color of visible light sources, the intensity of ambient lighting, and can insert virtual light source into the scene. We propose using the diffusion model's photorealistic prior to implicitly simulate complex light effects such as indirect illumination, shadows, and reflections, directly in image space, using paired examples depicting controlled illumination changes.

We generate such examples using a combination of a small set of raw photograph pairs supplemented by a large set of synthetically rendered images. By leveraging the linearity of light, we disentangle a target light from the scenes ambient lighting, and then generate a parametric sequence of images with varying light intensities and colors.

Our method generates physically plausible lighting edits across diverse settings, and outperforms existing methods quantitatively and based on user preference.

<a href=""><img src="https://img.shields.io/badge/arXiv-2412.06753-b31b1b.svg"></a>
<a href="https://nadmag.github.io/LightLab/"><img src="https://img.shields.io/static/v1?label=Project&message=Website&color=red" height=20.5></a> 



## 🔥 NEWS
**`2025/05/06`**: LightLab was accepted to SIGGRAPH 25!

**`2025/05/06`**: Paper is out!

<!-- ## Table of Contents
- [Examples](#examples)
- [Citation](#citation)


## Examples
Here are some example outputs:

<p align="center">
<img src="docs/examples_generation_1.jpg" width="800px"/>  
<br>
<p align="center">
<img src="docs/examples_dropout_rooster.jpg" width="700px"/>  
<br>
<p align="center">
<img src="docs/examples_dropout_bunny.jpg" width="700px"/>  
<br>
<p align="center">
<img src="docs/examples_dropout_astronaut.jpg" width="700px"/>  
<br>
<p align="center">
<img src="docs/examples_control_color_sydney.jpg" width="700px"/>  
<br>
<p align="center">
<img src="docs/examples_sketches_margarita.jpg" width="700px"/>  
<br> -->
