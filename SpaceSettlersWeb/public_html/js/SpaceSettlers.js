function SpaceSettlers()
{
    "use strict";

    this.ticker = new Ticker();

    this.entityManager = new ECS.EntityManager();
    this.entityManager.registerComponent('Transform', Transform);
    this.entityManager.registerComponent('Renderable', Renderable);
    this.entityManager.registerComponent('Camera', Camera);
    this.entityManager.registerComponent('Vehicle', Vehicle);
    this.entityManager.registerComponent('Inventory', Inventory);
    this.entityManager.registerComponent('World', World);
    this.entityManager.registerComponent('Chunk', Chunk);
    this.entityManager.registerComponent('InputReceiver', InputReceiver);
    this.entityManager.registerComponent('Pickable', Pickable);
    this.entityManager.registerComponent('PickingMessage', PickingMessage);
    this.entityManager.registerComponent('Selected', Selected);

    {
        var cameraEntity = this.entityManager.createEntity(['Transform', 'Camera', 'InputReceiver']);
        this.entityManager.addTag(cameraEntity, 'Camera');
        var camera = this.entityManager.getComponent(cameraEntity, 'Camera');
        camera.radius = 50.0;
        camera.lookAt = new THREE.Vector3(0, 0, 0);
        camera.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    }



    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor);

    this.vehicleProcessor = new VehicleProcessor(this.entityManager, this.ticker);
    this.entityManager.registerProcessor(this.vehicleProcessor);

    this.inventoryStatusProcessor = new InventoryStatusProcessor(this.entityManager, this.renderingProcessor);
    this.entityManager.registerProcessor(this.inventoryStatusProcessor);

    this.cameraProcessor = new CameraProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.cameraProcessor);

    this.inputProcessor = new InputProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.inputProcessor);

    this.pickingProcessor = new PickingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.pickingProcessor);
    
    this.buildProcessor = new BuildProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.buildProcessor);
    
    

    {
        this.worldGenerator = new WorldGenerator(this.entityManager);
        this.world = this.worldGenerator.generateWorld({x: 8, y: 8}, 16);
    }
    
    {
        this.selectedObject = this.entityManager.createEntity(['Transform', 'Selected']); 
        var transform = this.entityManager.getComponent(this.selectedObject, 'Transform'); 
        var selected = this.entityManager.getComponent(this.selectedObject, 'Selected'); 
        transform.position = new THREE.Vector3(10, 0, 10); 
        selected.sideLength = 1; 
        this.buildProcessor.placeObject(); 
    }


    {
        this.station1 = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
        var transform = this.entityManager.getComponent(this.station1, 'Transform');
        var renderable = this.entityManager.getComponent(this.station1, 'Renderable');
        var inventory = this.entityManager.getComponent(this.station1, 'Inventory');
        transform.position = new THREE.Vector3(-10, 10, 0);

        inventory.currentLoad = 3000;
        inventory.maxLoad = 3000;

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }

    {
        this.station2 = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
        var transform = this.entityManager.getComponent(this.station2, 'Transform');
        var renderable = this.entityManager.getComponent(this.station2, 'Renderable');
        var inventory = this.entityManager.getComponent(this.station2, 'Inventory');
        transform.position = new THREE.Vector3(10, 10, 0);

        inventory.currentLoad = 0;
        inventory.maxLoad = 3000;

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshLambertMaterial({color: 0xff0000});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }

    {
        this.station3 = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
        var transform = this.entityManager.getComponent(this.station3, 'Transform');
        var renderable = this.entityManager.getComponent(this.station3, 'Renderable');
        var inventory = this.entityManager.getComponent(this.station3, 'Inventory');
        transform.position = new THREE.Vector3(0, -10, 0);

        inventory.currentLoad = 3000;
        inventory.maxLoad = 3000;

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshLambertMaterial({color: 0xff0000});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }

    // Testing
    // Create a test box.
    {
        this.vehicle1 = this.entityManager.createEntity(['Transform', 'Renderable', 'Vehicle', 'Inventory']);
        var transform = this.entityManager.getComponent(this.vehicle1, 'Transform');
        var renderable = this.entityManager.getComponent(this.vehicle1, 'Renderable');
        var vehicle = this.entityManager.getComponent(this.vehicle1, 'Vehicle');
        var inventory = this.entityManager.getComponent(this.vehicle1, 'Inventory');
        transform.position = new THREE.Vector3(0, 0, 0);
        vehicle.orders.push(new Order(this.station1, VehicleActions.Load));
        vehicle.orders.push(new Order(this.station2, VehicleActions.Unload));
        vehicle.orders.push(new Order(this.station3, VehicleActions.Load));

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }



    this.ticker.start(this, this.update);
}

SpaceSettlers.prototype.update = function()
{
    this.entityManager.update();
}

$(document).ready(function() {
    var settlers = new SpaceSettlers();
});
