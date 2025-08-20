# Earth

![Earth, the final frontier](https://github.com/gabereiser/earth/blob/main/docs/screenshot.png?raw=true)

### Summary

An example of (yet another) atmospheric scattering from space of Earth, utilizing 8k textures.

This work is based on a long history of papers and research. However, the basis of this goes back to Sean O'Neil (2002) from GPU Game Gems. People have tweaked it, faked it, used approximations or fresnel blending to make it look like an atmosphere but lacked the rayleigh wavelength function and ray sampling.

Modern day simulators do this in reverse from the ground. You'll notice I also calculate ground haze as well as a density function of the atmosphere sample.


### Building

`npm i && npm run build`


### Running it locally

`npm run dev`