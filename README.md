# Mach1 Spatial Web Examples

### Description
A consolidated web spatial audio player for Mach1 Spatial playback with two goals: 
 - Exploration of different methods of orientation sensing and best practices for headtracking UX as an ongoing R&D project for spatial and multichannel audio playback
 - Simplified playback tool that in concert with Mach1Transcode API can aggregate all soundfield formats and play them back with a simple single player object

### Setup
 - Use `./download-audiofiles.sh` (or `./download-audiofiles.bat` if on WIN) to download some prepared debug playback audio

### Usage
We have exposed some settings to extend usability of the facetracker mode. 

- `yawMultiplier` - Multiplies the yaw rotation to allow experimentation with extending the limited range of motion from "facetracking", making it `1.0` is recommended for natural headtracking however raising it up to `2.0` is still believable in terms of associating the audio results with your headtracking motion; anything past `2.0` breaks immersion 
- `pitchMultiplier` - Multiplies the pitch rotation to allow experimentation with extending the limited range of motion from "facetracking", we found it to be best to keep it as close to `1.0` as possible
- `rollMultiplier` - Multiplies the roll rotation to allow experimentation with extending the limited range of motion from "facetracking", we found it to be best to keep it as close to `1.0` as possible
- `FOV` - We clamp the yaw range from "facetracking" to lessen low confidence results from causing large rotation jumps when unable to view full face
- `filterSpeed` - An additional filter to smooth results applied to Mach1Decode during audio playback to stereo
- `oneEuroFilterBeta` - The filter beta for the 1Euro implementation

## Orientation Inputs

### Facetracking
After exploring several web based facetrackers we have had the most success with [MediaPipe FaceMesh](https://github.com/google/mediapipe). Landmark tracking with FaceMesh wasn't designed for us to calculate orientation rotations to be applied to something as sensitive as spatial audio playback, so we had to apply a filter to the motion results to "smooth" out any low frequency jitters. This can be seen via the [1Euro filter](https://cristal.univ-lille.fr/~casiez/1euro/) implementation: 

```
window.createOneEuroFilters = function createOneEuroFilters() {
    fYaw = OneEuroFilter(60, 1.0, window.controls.oneEuroFilterBeta, 1.0);
    fPitch = OneEuroFilter(60, 1.0, window.controls.oneEuroFilterBeta, 1.0);
    fRoll = OneEuroFilter(60, 1.0, window.controls.oneEuroFilterBeta, 1.0);
};
```

### Mobile Device IMU
**Coming soon...**

### Mouse UI
Implemented a simple mouse control bound to width of window


### Bose AR IMU
**Coming soon...**