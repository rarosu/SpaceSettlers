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

    this.cameraEntity = this.entityManager.createEntity(['Camera']);
    this.entityManager.addTag(this.cameraEntity, 'Camera');
    var camera = this.entityManager.getComponent(this.cameraEntity, 'Camera');
    camera.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    camera.camera.position.set(0, -15, 25);
    camera.camera.lookAt(new THREE.Vector3().addVectors(camera.camera.position, new THREE.Vector3(0, 1, -1)));

    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor, ['Transform', 'Renderable']);

    this.vehicleProcessor = new VehicleProcessor(this.entityManager, this.ticker);
    this.entityManager.registerProcessor(this.vehicleProcessor, ['Transform', 'Vehicle']);

    this.inventoryStatusProcessor = new InventoryStatusProcessor(this.entityManager, this.renderingProcessor);
    this.entityManager.registerProcessor(this.inventoryStatusProcessor, ['Inventory', 'Transform']);

    {
        this.worldGenerator = new WorldGenerator(this.entityManager);
        this.world = this.worldGenerator.generateWorld({x: 8, y: 8}, 16);
        /*
        var self = this;
        $.ajax({
                url: "assets/world1.html",
                async: false,
                dataType: "json"
            }).done(function(data) {
                self.createWorld(data);
            });
        */
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

SpaceSettlers.prototype.createWorld = function(data)
{
    /*
    this.world = this.entityManager.createEntity(['World']);
    var worldComponent = this.entityManager.getComponent(this.world, 'World');

    var chunksPerRow = data.chunksPerRow;
    for(var c = 0; c < data.chunks.length; c++)
    {
        var vertices = new Float32Array(data.chunkSize * data.chunkSize * 6 * 3);


        // 1,6    2
        //
        // 5    3,4
        for(var y = 0; y < data.chunkSize; y++)
        {
           for(var x = 0; x < data.chunkSize; x++)
           {
               var tileIndex = x + y * data.chunkSize;
               var height = data.chunks[c][tileIndex].height;
               var slope = data.chunks[c][tileIndex].slope;

               var index = tileIndex * 6 * 3;
               vertices[index] = x;
               vertices[index+1] = y;
               vertices[index+2] = height + (slope & 0x1);

               vertices[index+3] = x+1;
               vertices[index+4] = y;
               vertices[index+5] = height + ((slope & 0x2) >> 1);

               vertices[index+6] = x+1;
               vertices[index+7] = y+1;
               vertices[index+8] = height + ((slope & 0x3) >> 2);


               vertices[index+9] = x+1;
               vertices[index+10] = y+1;
               vertices[index+11] = height + ((slope & 0x3) >> 2);

               vertices[index+12] = x;
               vertices[index+13] = y+1;
               vertices[index+14] = height + ((slope & 0x4) >> 3);

               vertices[index+15] = x;
               vertices[index+16] = y;
               vertices[index+17] = height + (slope & 0x1);
           }
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshBasicMaterial({color: 0xffffff});

        var chunk = this.entityManager.createEntity(['Transform', 'Renderable']);

        var transform = this.entityManager.getComponent(chunk, 'Transform');
        var renderable = this.entityManager.getComponent(chunk, 'Renderable');
        renderable.mesh = new THREE.Mesh(geometry, material);
        var chunkRow = Math.floor(c / chunksPerRow);
        var chunkCol = c % chunksPerRow;
        transform.position = new THREE.Vector3(chunkCol * data.chunkSize,chunkRow * data.chunkSize,0);

        var edges = this.entityManager.createEntity(['Transform', 'Renderable']);
        var edgesRenderable = this.entityManager.getComponent(edges, 'Renderable');
        edgesRenderable.mesh = new THREE.WireframeHelper( renderable.mesh, 0x00ff00 );

        worldComponent.chunks.push(chunk);
    }
    */
}

$(document).ready(function() {
    var settlers = new SpaceSettlers();
});
