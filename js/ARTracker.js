var ARTracker = {
    setup: function() {
        window.ARThreeOnLoad = function() {

            ARController.getUserMediaThreeScene({
                maxARVideoSize: 640,
                cameraParam: 'Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
                onSuccess: function(arScene, arController, arCamera) {

                    //document.body.className = arController.orientation;

                    arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);
					arController.setThresholdMode(artoolkit.AR_LABELING_THRESH_MODE_AUTO_MEDIAN);

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


                        var markerRoot = arController.createThreeBarcodeMarker(i, 1);
                        markerRoot.add(sphere);
                        arScene.scene.add(markerRoot);
                    }

                    var lastDetectedBarcodeRot = [];
                    var lastDetectedBarcodeTime = -1;

                    var detectedBarcodeMarkers = {};
                    arController.addEventListener('getMarker', function(ev) {
                        var barcodeId = ev.data.marker.idMatrix;
                        if (barcodeId !== -1 && barcodeId < maxCountBarcodes) {
                            //console.log("saw a barcode marker with id", barcodeId);

                            var transform = ev.data.matrix;
                            if (!detectedBarcodeMarkers[barcodeId]) {
                                detectedBarcodeMarkers[barcodeId] = {
                                    visible: true,
                                    matrix: new Float32Array(16)
                                }
                            }
                            detectedBarcodeMarkers[barcodeId].visible = true;
                            detectedBarcodeMarkers[barcodeId].matrix.set(transform);

                            // get matrix
                            var mat = new THREE.Matrix4();
                            mat.fromArray(detectedBarcodeMarkers[barcodeId].matrix, 0);

                            var worldPos = new THREE.Vector3();
                            var worldQuat = new THREE.Quaternion();
                            var worldScale = new THREE.Vector3();

                            mat.decompose(worldPos, worldQuat, worldScale);

                            var worldRot = new THREE.Euler().setFromQuaternion(worldQuat, 'XYZ');

                            var x = THREE.Math.radToDeg(worldRot.x);
                            var y = THREE.Math.radToDeg(worldRot.y);
                            var z = THREE.Math.radToDeg(worldRot.z);

							//console.log("barcodeId", barcodeId);

                            lastDetectedBarcodeRot = [
                                x > 0 ? -(180 - x) : x + 180,
                               window.modeTracker == "artracker" ? (y + barcodeId * 360.0 / 6 ) : (y - 90 + (360.0 - barcodeId * 360.0) / 2 ),
                                z
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