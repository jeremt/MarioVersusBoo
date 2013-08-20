
~function () {

function BooSpawner(params) {
  this.interval = params.interval || 5;
  this.target = params.target;
  this.camera = params.camera || window.camera;
  this.scene = params.scene;
  this.boos = [];
  this.currentTime = 0;
}

var _spawn = function (self, event) {
  if (self.currentTime > self.interval) {
    var boo = new Boo({
      target: self.target,
      camera: self.camera
    });
    self.boos.push(boo);
    self.scene.add(boo.mesh);
    self.currentTime = 0;
    if (self.interval > 0.5)
      self.interval *= 0.8;
  }
  self.currentTime += event.deltaTime;
}

var _clear = function (self) {
  for (var i = self.boos.length - 1; i >= 0; --i) {
    if (self.boos[i].died) {
      self.scene.remove(self.boos[i].mesh);
      self.boos.splice(i, 1);
    }
  }
}

BooSpawner.prototype.clear = function () {
  for (var i = 0; i < this.boos.length; ++i)
    this.scene.remove(this.boos[i].mesh);
}

BooSpawner.prototype.update = function (event) {
  _spawn(this, event);
  _clear(this);
  for (var i = 0; i < this.boos.length; ++i)
    this.boos[i].update(event);
}

window.BooSpawner = BooSpawner;

}();