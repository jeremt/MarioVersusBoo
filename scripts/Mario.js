
~function () {

function Mario(params) {
  params || (params = {});
  var skin = new THREE.ImageUtils
    .loadTexture("images/mario.png");
  this.scene = params.scene;
  this.camera = params.camera;

  // lifes

  this.lifes = params.lifes || 5;
  var lifeMaterial = new THREE.SpriteMaterial({
    map: new THREE.ImageUtils.loadTexture("images/life.png")
  });
  this.lifesSprites = [];
  for (var i = 0; i < this.lifes; ++i) {
    this.lifesSprites.push(new THREE.Sprite(lifeMaterial));
    this.lifesSprites[i].scale.set(50, 50, 1);
    this.lifesSprites[i].position.set(50 + 50 * i, 50, 0);
    this.scene.add(this.lifesSprites[i]);
  }

  // animations

  this.anim = new THREE.SpriteAnimation({
    texture: skin,
    tilesHorizontal: 6,
    tilesVertical: 4,
    numberOfTiles: 24,
    delay: 42
  });

  this.anim.add("idle",     {from: 22, to: 22});
  this.anim.add("left",     {from:  0, to:  5});
  this.anim.add("backward", {from:  6, to: 11});
  this.anim.add("right",    {from: 12, to: 17});
  this.anim.add("forward",  {from: 18, to: 23});

  this.anim.play("idle");

  // display

  var material = new THREE.MeshBasicMaterial({map: skin});
  material.transparent = true;
  this.mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    material
  );

  this.mesh.position.x += 25;
  this.mesh.position.y += 25;
  this.mesh.position.z += 25;

  this.scene.add(this.mesh);

  this.died = false;

  // spot light
  this.light = new THREE.PointLight(0xffffff);
  this.light.distance = 200;
  this.light.position = this.mesh.position.clone();
  this.light.position.y += 20;
  this.scene.add(this.light);

}

Mario.prototype.decreaseLife = function () {
  if (this.lifes === 0) {
    this.died = true;
    return ;
  }
  this.lifes--;
  this.scene.remove(this.lifesSprites[this.lifes]);
  this.lifesSprites.pop();
}

Mario.prototype.update = function (event) {
  if (this.died)
    return ;
  this.anim.update(event.deltaTime * 1000);
  _move(this);
  _jump(this, event.deltaTime);

  this.light.position = this.mesh.position.clone();
  this.light.position.y += 50;

  // TODO - create a floor object instead.
  var floorSize = 700;
  if (this.mesh.position.z < -floorSize / 2) {
    this.camera.position.z += floorSize;
    this.mesh.position.z += floorSize;
  } else if (this.mesh.position.z > floorSize / 2) {
    this.camera.position.z -= floorSize;
    this.mesh.position.z -= floorSize;
  }
  if (this.mesh.position.x < -floorSize / 2) {
    this.camera.position.x += floorSize;
    this.mesh.position.x += floorSize;
  } else if (this.mesh.position.x > floorSize / 2) {
    this.camera.position.x -= floorSize;
    this.mesh.position.x -= floorSize;
  }
}

var _move = function (self) {
  if (THREE.Input.isKeyPressed("W"))
    self.anim.play("forward");
  else if (THREE.Input.isKeyPressed("S"))
    self.anim.play("backward");
  else if (THREE.Input.isKeyPressed("Q"))
    self.anim.play("left");
  else if (THREE.Input.isKeyPressed("E"))
    self.anim.play("right");
  else if (!THREE.Input.isKeyPressed())
    self.anim.play("idle");
}

var _lerp = function (dest, src, delta) {
  return src + (dest - src) * delta;
}

var _jump = function (self) {
  if (THREE.Input.isKeyPressed("space"))
    console.log("JUMP");
}

window.Mario = Mario;

}();