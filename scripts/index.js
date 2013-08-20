
~function () {

var context = new THREE.Context();
var score = document.getElementById("score");

// debug
window.context = context;

context.addEventListener("start", function () {

  this.isGameOver = false;

  // create floor
  var floorTexture =
    new THREE.ImageUtils.loadTexture('images/wood.jpg');
  floorTexture.wrapS =
    floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set(20, 20);
  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000, 20, 20),
    new THREE.MeshLambertMaterial({
      map: floorTexture
    })
  );
  floor.rotation.x = -Math.PI / 2;
  this.scene.add(floor);

  // create player
  this.mario = new Mario({
    scene: this.scene,
    camera: this.camera
  });

  //create boo spawner
  this.booSpawner = new BooSpawner({
    target: this.mario,
    camera: this.camera,
    scene: this.scene
  });

  // add third person controls on mario.
  this.controls = new THREE.ThirdPersonControls({
    camera: this.camera,
    target: this.mario.mesh,
    lerp: 0.05,
    contraints: new THREE.Vector2(1, 0)
  });

  this.mario.controls = this.controls;

});

context.addEventListener("frame", function (event) {
  if (this.mario.died) {
    this.gameOver();
    return ;
  }
  if (this.isGameOver)
    return ;
  this.mario.update(event);
  this.booSpawner.update(event);
  score.innerHTML = "Score " + ~~this.clock.getElapsedTime();

  // Dirty tricks to change keyboard layout
  if (THREE.Input.isKeyDown("Z"))
    this.controls.keyMapping = "azerty";
  if (THREE.Input.isKeyDown("W"))
    this.controls.keyMapping = "qwerty";

});

context.gameOver = function () {
  if (this.isGameOver)
    return ;

  // add 3D text
  var textMesh = new THREE.Mesh(
    new THREE.TextGeometry( "YOUR SCORE IS " + ~~this.clock.getElapsedTime(), {
      size: 20,
      height: 6,
      font: "pipe dream",
      extrudeMaterial: 1
    }),
    new THREE.MeshFaceMaterial([
      new THREE.MeshBasicMaterial({color: 0xeeeeee}),
      new THREE.MeshBasicMaterial({color: 0x222222})
    ])
  );

  textMesh.geometry.computeBoundingBox();
  var textWidth =
    textMesh.geometry.boundingBox.max.x
  - textMesh.geometry.boundingBox.min.x;

  var subTextMesh = new THREE.Mesh(
    new THREE.TextGeometry( "(REFRESH TO PLAY AGAIN)", {
      size: 6,
      height: 6,
      font: "pipe dream",
      extrudeMaterial: 1
    }),
    new THREE.MeshFaceMaterial([
      new THREE.MeshBasicMaterial({color: 0xeeeeee}),
      new THREE.MeshBasicMaterial({color: 0x222222})
    ])
  );

  subTextMesh.geometry.computeBoundingBox();
  var subTextWidth =
    subTextMesh.geometry.boundingBox.max.x
  - subTextMesh.geometry.boundingBox.min.x;

  subTextMesh.translateX(textWidth / 2 - subTextWidth / 2);
  subTextMesh.translateY(-20);
  textMesh.add(subTextMesh);

  textMesh.position = this.mario.mesh.position.clone();
  textMesh.lookAt(this.camera.position);
  textMesh.translateX(-textWidth / 2);
  textMesh.translateY(20);
  this.scene.add(textMesh);

  this.isGameOver = true;
  this.controls = new THREE.OrbitControls(
    this.camera, this.renderer.domElement
  );
  this.controls.center = this.mario.mesh.position.clone();
  this.scene.remove(this.mario.mesh);
  this.booSpawner.clear();
}

context.start();

}();