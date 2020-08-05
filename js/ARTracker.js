var ARTracker = {
    setup: function() {
        window.ARThreeOnLoad = function() {

            ARController.getUserMediaThreeScene({
                maxARVideoSize: 640,
                cameraParam: 'Data/camera_para.dat',
                onSuccess: function(arScene, arController, arCamera) {

                    //document.body.className = arController.orientation;

					arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
					//arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_OTSU);
					arController.setMatrixCodeType(artoolkit.AR_MATRIX_CODE_3x3_HAMMING63);


                   //arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);

                    var renderer = new THREE.WebGLRenderer({
                        antialias: true
                    });
                    if (arController.orientation === 'portrait') {
                        var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
                        var h = window.innerWidth;
                        renderer.setSize(w, h);
                        renderer.domElement.style.paddingBottom = (w - h) + 'px';
                    } else {
                        if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
                            renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
                        } else {
                            renderer.setSize(arController.videoWidth, arController.videoHeight);
                            //document.body.className += ' desktop';
                        }
                    }

                    //document.body.insertBefore(renderer.domElement, document.body.firstChild);

                    var rotationV = 0;
                    var rotationTarget = 0;

                    renderer.domElement.addEventListener('click', function(ev) {
                        ev.preventDefault();
                        rotationTarget += 1;
                    }, false);

                    var sphere = new THREE.Mesh(
                        new THREE.SphereGeometry(1.0, 8, 8),
                        new THREE.MeshNormalMaterial()
                    );
                    sphere.material.flatShading;
                    sphere.position.z = 0.0;

                    var torus = new THREE.Mesh(
                        new THREE.TorusGeometry(0.3 * 2.5, 0.2 * 2.0, 8, 8),
                        new THREE.MeshNormalMaterial()
                    );
                    torus.material.flatShading;
                    torus.position.z = 1.25;
                    torus.rotation.x = Math.PI / 2;

                    var cube = new THREE.Mesh(
                        new THREE.BoxGeometry(1, 1, 1),
                        new THREE.MeshNormalMaterial()
                    );
                    cube.material.flatShading;
                    cube.position.z = 0.5;

                    var icosahedron = new THREE.Mesh(
                        new THREE.IcosahedronGeometry(0.7, 1, 1),
                        new THREE.MeshNormalMaterial()
                    );
                    icosahedron.material.flatShading;
                    icosahedron.position.z = 0.0;

					var maxCountBarcodes = 6;
                    console.log("maxCountBarcodes", maxCountBarcodes);
                    for (var i = 0; i < maxCountBarcodes; i++) {
                        var sphere = new THREE.Mesh(
                            new THREE.SphereGeometry(1.0, 8, 8),
                            new THREE.MeshNormalMaterial()
                        );
                        sphere.material.flatShading;
                        sphere.position.z = 0.0;
						
						/*
						arController.loadMarker('Data/pattern-m0'+(i+1)+'.patt', function(markerId) {
							var markerRoot = arController.createThreeMarker(markerId);
							markerRoot.add(sphere);
							arScene.scene.add(markerRoot);
						});
						*/
						///*
                        var markerRoot = arController.createThreeBarcodeMarker(i,1);
                        markerRoot.add(sphere);
                        arScene.scene.add(markerRoot);
						//*/
                    }
					
					/*
					arController.loadMultiMarker('Data/multi-barcode.dat', function(marker, markerNum) {
						
						 var sphere = new THREE.Mesh(
                            new THREE.SphereGeometry(1.0, 8, 8),
                            new THREE.MeshNormalMaterial()
                        );
                        sphere.material.flatShading;
                        sphere.position.z = 0.0;
						
						
						// Create an object that tracks the marker transform.
						var markerRoot = arController.createThreeMultiMarker(marker);
						arScene.scene.add(sphere);
						markerRoot.add(sphere);
					});
					*/

                    var lastDetectedBarcodeRot = [0,0,0];
                    var lastDetectedBarcodeTime = -1;

                    var detectedBarcodeMarkers = {};
                    arController.addEventListener('getMarker', function(ev) {
						
                        var markerId = ev.data.marker.idMatrix; // ev.data.marker.id; //
                        if (markerId > -1 && markerId < maxCountBarcodes ) { //&& ev.data.marker.dir == 2) { // && ev.data.marker.cf > 0.3) {
                            
							//console.log("saw a barcode marker with id", markerId, ev.data.marker.id, ev.data.marker.idMatrix );
							//console.log("dir >> ", ev.data.marker.dir );

                            var transform = ev.data.matrixGL_RH  ; // matrix;
                            if (!detectedBarcodeMarkers[markerId]) {
                                detectedBarcodeMarkers[markerId] = {
                                    visible: true,
                                    matrix: new Float32Array(16),
                                }
                            }
                            detectedBarcodeMarkers[markerId].visible = true;
                            detectedBarcodeMarkers[markerId].matrix.set(transform);

                            // get matrix
                            var mat = new THREE.Matrix4();
                            mat.fromArray(detectedBarcodeMarkers[markerId].matrix, 0);

                            var worldPos = new THREE.Vector3();
                            var worldQuat = new THREE.Quaternion();
                            var worldScale = new THREE.Vector3();

                            mat.decompose(worldPos, worldQuat, worldScale);

                            var worldRot = new THREE.Euler().setFromQuaternion(worldQuat, 'XYZ');

                            var x = THREE.Math.radToDeg(worldRot.x);
                            var y = THREE.Math.radToDeg(worldRot.y);
                            var z = THREE.Math.radToDeg(worldRot.z);

							console.log("markerId", markerId);

	 
							var x_ = x > 0 ? -(180 - x) : x + 180;
							var y_ = window.modeTracker == "artracker" ? (y + markerId * 360.0 / 6) : (y - 90 + (360.0 - markerId * 360.0) / 2 );
							//if(y_ < 0) y_ = 360 + y_;
	 
							var smooth = 0.0;
                            lastDetectedBarcodeRot = [
                               lastDetectedBarcodeRot[0] * smooth + x_ * (1-smooth), 
                               lastDetectedBarcodeRot[1] * smooth + y_ * (1-smooth),
                               lastDetectedBarcodeRot[2] * smooth + z * (1-smooth)
                            ];
                            lastDetectedBarcodeTime = performance.now();
                        }
                    });


                    var tick = function() {
                        arScene.process();

                        //console.log(arController.getMarker(0));
                        if (performance.now() - lastDetectedBarcodeTime < 500) {
							if (window.modeTracker == "artracker" || (window.modeTracker == "artrackerWithFacetracker" && window.recognizedFace == false)) {
								window.yaw = lastDetectedBarcodeRot[1];
								window.pitch = lastDetectedBarcodeRot[0];
								window.roll = lastDetectedBarcodeRot[2];
								console.log("ar detected", window.yaw, window.pitch, window.roll);
							}
                        }

                        arScene.renderOn(renderer);
                        requestAnimationFrame(tick);
                    };

                    tick();

                }
            });

            delete window.ARThreeOnLoad;

        };

        if (window.ARController && ARController.getUserMediaThreeScene) {
            ARThreeOnLoad();
        }
    },
};