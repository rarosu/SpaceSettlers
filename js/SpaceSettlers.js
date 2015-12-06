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

    {
        this.cameraEntity = this.entityManager.createEntity(['Camera', 'Transform', 'InputReceiver']);
        this.entityManager.addTag(this.cameraEntity, 'Camera');
        var camera = this.entityManager.getComponent(this.cameraEntity, 'Camera');
        var transform = this.entityManager.getComponent(this.cameraEntity, 'Transform');
        var inputReceiver = this.entityManager.getComponent(this.cameraEntity, 'InputReceiver');

        inputReceiver.mouseDown = function(cameraEntity, entityManager) {
            var camera = entityManager.getComponent(cameraEntity, 'Camera');
            camera.azimuthalSaved = camera.azimuthal;
            camera.polarSaved = camera.polar;
        };

        inputReceiver.mouseMove = function(cameraEntity, entityManager) {
            var camera = entityManager.getComponent(cameraEntity, 'Camera');
            var transform = entityManager.getComponent(cameraEntity, 'Transform');
            var inputReceiver = entityManager.getComponent(cameraEntity, 'InputReceiver');
            if(inputReceiver.mouseLeftDown)
            {
                camera.azimuthal += inputReceiver.mousePositionDelta.x / 100;
                camera.polar += inputReceiver.mousePositionDelta.y / 100;
            }

            transform.position = new THREE.Vector3(camera.radius * Math.sin(camera.polar)  * Math.cos(camera.azimuthal), camera.radius * Math.sin(camera.polar) * Math.sin(camera.azimuthal), camera.radius * Math.cos(camera.polar));

            camera.camera.position.set(transform.position.x, transform.position.y, transform.position.z);
            camera.camera.lookAt(new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z));
            //camera.
            };

        transform.position = new THREE.Vector3(camera.radius * Math.sin(camera.polar)  * Math.cos(camera.azimuthal), camera.radius * Math.sin(camera.polar) * Math.sin(camera.azimuthal), camera.radius * Math.cos(camera.polar));
        camera.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000.0);

        camera.camera.position.set(transform.position.x, transform.position.y, transform.position.z);
        camera.camera.lookAt(new THREE.Vector3(0, 0, 0));

        

    }


    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor);

    this.vehicleProcessor = new VehicleProcessor(this.entityManager, this.ticker);
    this.entityManager.registerProcessor(this.vehicleProcessor);

    this.inventoryStatusProcessor = new InventoryStatusProcessor(this.entityManager, this.renderingProcessor);
    this.entityManager.registerProcessor(this.inventoryStatusProcessor);

    this.inputProcessor = new InputProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.inputProcessor);

    {
        this.worldGenerator = new WorldGenerator(this.entityManager);
        this.world = this.worldGenerator.generateWorld({x: 8, y: 8}, 16);
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

    {
        var cameraEntity = this.entityManager.getEntityByTag('Camera');
        var camera = this.entityManager.getComponent(cameraEntity, 'Camera')
        var transform = this.entityManager.getComponent(cameraEntity, 'Transform');
        var inputReceiver = this.entityManager.getComponent(cameraEntity, 'InputReceiver');

        if(inputReceiver.keyCodes.indexOf(87) >= 0) {
            transform.position.y += 0.5;
            camera.lookAt.y += 0.5;
        }

        if(inputReceiver.keyCodes.indexOf(83) >= 0) {
            transform.position.y -= 0.5;
            camera.lookAt.y -= 0.5;
        }

        if(inputReceiver.keyCodes.indexOf(65) >= 0) {
            transform.position.x -= 0.5;
            camera.lookAt.x -= 0.5;
        }

        if(inputReceiver.keyCodes.indexOf(68) >= 0) {
            transform.position.x += 0.5;
            camera.lookAt.x += 0.5;
        }

        //camera.camera.position.set(transform.position.x, transform.position.y, transform.position.z);
        //camera.camera.lookAt(new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z));
    }


}

$(document).ready(function() {
    var settlers = new SpaceSettlers();
});
