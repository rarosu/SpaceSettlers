function SpaceSettlers()
{
    this.entityManager = new ECS.EntityManager();
    this.entityManager.registerComponent('Transform', Transform);
    this.entityManager.registerComponent('Renderable', Renderable);
    this.entityManager.registerComponent('Camera', Camera);

    this.cameraEntity = this.entityManager.createEntity(['Camera']);
    this.entityManager.addTag(this.cameraEntity, 'Camera');
    var camera = this.entityManager.getComponent(this.cameraEntity, 'Camera');
    camera.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    camera.camera.position.set(0, -1, 5);
    camera.camera.lookAt(new THREE.Vector3().addVectors(camera.camera.position, new THREE.Vector3(0, 0, -1)));

    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor, ['Transform', 'Renderable']);

    // Testing
    // Create a test box.
    {
        this.boxEntity = this.entityManager.createEntity(['Transform', 'Renderable']);
        var transform = this.entityManager.getComponent(this.boxEntity, 'Transform');
        var renderable = this.entityManager.getComponent(this.boxEntity, 'Renderable');
        transform.position = new THREE.Vector3(0, 5, 0);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }

    this.ticker = new Ticker();
    this.ticker.start(this, this.update);
}

SpaceSettlers.prototype.update = function()
{
    this.entityManager.update();
}

var settlers = new SpaceSettlers();
