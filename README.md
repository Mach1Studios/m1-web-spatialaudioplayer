# Mach1 Spatial Headtracking Examples

## Demos
List of already deployed demos utilizing concepts of Mach1 Spatial and facetracking
 - [Dual Layer Mach1Spatial](https://player.mach1.tech/demo/dual-layer/M1SpatialAudioPlayer.html) (Branch: [/demo-example/dual-layer](https://github.com/Mach1Studios/m1-web-spatialaudioplayer/tree/demo-example/dual-layer-m1spatial))
 - [Mach1Spatial + Stereo Object](https://player.mach1.tech/demo/stereo-object/M1SpatialAudioPlayer.html) (Branch: [/demo-example/depth-object](https://github.com/Mach1Studios/m1-web-spatialaudioplayer/tree/demo-example/depth-object))
 - [Content Demos](https://demos.mach1.tech)

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
Running this demo on a mobile device will now use the device's IMU sensor with gimbal rotations to ensure holding in portrait mode will have a smooth and expected full 3DOF rotations.

### Mouse UI
When utilizing `Touch` mode a simple mouse control bound to width of window will be used as the input orientation for the `Mach1Decode` object(s) and for the OSC output.

### Bose AR IMU
When utilizing `Bose AR` mode a connection prompt and handler supplied by the [BoseAR Web SDK](https://github.com/zakaton/Bose-Frames-Web-SDK) will be utilized for the input orientation for the `Mach1Decode` object(s) and for the OSC output.

## License
Use of the Mach1Decode API in this example falls under the license supplied in this repo and derived from the [Mach1 Spatial SDK](https://github.com/Mach1Studios/m1-sdk) viewable [here](https://github.com/Mach1Studios/m1-sdk/tree/master/license)