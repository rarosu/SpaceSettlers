function SpaceSettlers()
{
    this.ticker = new Ticker();

    this.entityManager = new ECS.EntityManager();
    this.entityManager.registerComponent('Transform', Transform);
    this.entityManager.registerComponent('Renderable', Renderable);
    this.entityManager.registerComponent('Camera', Camera);
    this.entityManager.registerComponent('Vehicle', Vehicle);
    this.entityManager.registerComponent('Inventory', Inventory);

    this.cameraEntity = this.entityManager.createEntity(['Camera']);
    this.entityManager.addTag(this.cameraEntity, 'Camera');
    var camera = this.entityManager.getComponent(this.cameraEntity, 'Camera');
    camera.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    camera.camera.position.set(0, -1, 25);
    camera.camera.lookAt(new THREE.Vector3().addVectors(camera.camera.position, new THREE.Vector3(0, 0, -1)));

    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor, ['Transform', 'Renderable']);

    this.vehicleProcessor = new VehicleProcessor(this.entityManager, this.ticker);
    this.entityManager.registerProcessor(this.vehicleProcessor, ['Transform', 'Vehicle']);

    // Testing
    // Create a test box.
    {
        this.vehicle1 = this.entityManager.createEntity(['Transform', 'Renderable', 'Vehicle', 'Inventory']);
        var transform = this.entityManager.getComponent(this.vehicle1, 'Transform');
        var renderable = this.entityManager.getComponent(this.vehicle1, 'Renderable');
        var vehicle = this.entityManager.getComponent(this.vehicle1, 'Vehicle');
        var inventory = this.entityManager.getComponent(this.vehicle1, 'Inventory');
        transform.position = new THREE.Vector3(0, 0, 0);
        vehicle.orders.push(new Order(new THREE.Vector3(-10, 10, 0), VehicleActions.Load));
        vehicle.orders.push(new Order(new THREE.Vector3(10, 10, 0), VehicleActions.Unload));
        vehicle.orders.push(new Order(new THREE.Vector3(0, -10, 0), VehicleActions.UnloadAndLoad));




        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
        renderable.mesh = new THREE.Mesh(geometry, material);


    }

    {
        this.textEntity = this.entityManager.createEntity(['Transform', 'Renderable']);
        var transform = this.entityManager.getComponent(this.textEntity, 'Transform');
        var renderable = this.entityManager.getComponent(this.textEntity, 'Renderable');

        transform.position = new THREE.Vector3(0, 0, 0);

        var sprite = this.renderingProcessor.getTextSprite('Loading... 76%');
        renderable.mesh = sprite;
    }

    this.ticker.start(this, this.update);
}

SpaceSettlers.prototype.update = function()
{
    this.entityManager.update();
}

var settlers = new SpaceSettlers();
