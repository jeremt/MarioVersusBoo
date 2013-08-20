
~function () {

function Boo(params) {
  params || (params = {});

  this.target = params.target;
  this.camera = params.camera;
  this.lifeTime = params.lifeTime || 5;
  this.died = false;

  var skin = THREE.ImageUtils
    .loadTexture("images/boo.png");
  this.anim = new THREE.SpriteAnimation({
    texture: skin,
    tilesHorizontal: 2,
    tilesVertical: 2,
    numberOfTiles: 4,
    delay: 500
  });
  this.anim.add("left", {from: 0, to: 1});
  this.anim.add("right", {from: 2, to: 3});
  this.anim.play("left");
  var material = new THREE.MeshBasicMaterial({
    map: skin,
    useScreenCoordinates: false
  });
  material.transparent = true;
  this.mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 1, 1),
    material
  );

  this.mesh.position = this.target.mesh.position.clone();
  var sign = ~~(Math.random() * 2) ? -1 : 1;
  var x = Math.random() * 100 + 100;
  var z = Math.random() * 100 + 100;
  this.mesh.position.x += sign * x;
  this.mesh.position.z += sign * z;
}

Boo.prototype.update = function (event) {
  if (this.died)
    return ;
  if (this.lifeTime < 0)
    this.died = true;
  if (this.mesh.position.distanceTo(this.target.mesh.position) < 40) {
    this.target.decreaseLife();
    this.died = true;
  }

  this.mesh.lookAt(this.target.mesh.position);
  this.mesh.translateZ(2);
  this.mesh.lookAt(this.camera.position);
  this.anim.update(event.deltaTime * 1000);
  this.lifeTime -= event.deltaTime;
}

window.Boo = Boo;

}();