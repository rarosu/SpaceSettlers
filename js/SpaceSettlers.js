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

    this.inventoryStatusProcessor = new InventoryStatusProcessor(this.entityManager, this.renderingProcessor);
    this.entityManager.registerProcessor(this.inventoryStatusProcessor, ['Inventory', 'Transform']);

    {
        // Vertex winding order:
        // 1,6    2
        //
        // 5    3,4
        var chunkSize = 16;
        var vertices = new Float32Array(chunkSize * chunkSize * 6 * 3);
        for(var y = 0; y < chunkSize; y++)
        {
           for(var x = 0; x < chunkSize; x++)
           {
               var index = (x + y * chunkSize) * 6 * 3;
               vertices[index] = x;
               vertices[index+1] = y;
               vertices[index+2] = 0;

               vertices[index+3] = x+1;
               vertices[index+4] = y;
               vertices[index+5] = 0;

               vertices[index+6] = x+1;
               vertices[index+7] = y+1;
               vertices[index+8] = 0;


               vertices[index+9] = x+1;
               vertices[index+10] = y+1;
               vertices[index+11] = 0;

               vertices[index+12] = x;
               vertices[index+13] = y+1;
               vertices[index+14] = 0;

               vertices[index+15] = x;
               vertices[index+16] = y;
               vertices[index+17] = 0;
           }
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        var chunk = this.entityManager.createEntity(['Transform', 'Renderable']);
        var transform = this.entityManager.getComponent(chunk, 'Transform');
        var renderable = this.entityManager.getComponent(chunk, 'Renderable');
        renderable.mesh = new THREE.Mesh(geometry, material);
        transform.position = new THREE.Vector3(-10,-10,0);

        var edges = this.entityManager.createEntity(['Transform', 'Renderable']);
        var edgesRenderable = this.entityManager.getComponent(edges, 'Renderable');
        edgesRenderable.mesh = new THREE.WireframeHelper( renderable.mesh, 0x00ff00 );
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

var settlers = new SpaceSettlers();
