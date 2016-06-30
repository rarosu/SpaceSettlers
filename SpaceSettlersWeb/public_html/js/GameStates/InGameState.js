define(function(require) {
    "use strict";
    
    var THREE = require('THREE');

    var BuildProcessor = require('BuildProcessor');
    var CameraProcessor = require('CameraProcessor');
    var InputProcessor = require('InputProcessor');
    var InventoryStatusProcessor = require('InventoryStatusProcessor');
    var PickingProcessor = require('PickingProcessor');
    var RenderingProcessor = require('Renderer');
    var TilePickingProcessor = require('TilePickingProcessor');
    var VehicleProcessor = require('VehicleProcessor');
    var WorldGenerator = require('WorldGenerator');
    var MenuProcessor = require('MenuProcessor'); 
    
    var VehicleOrder = require('Components/VehicleOrder');
    var VehicleActions = require('Components/VehicleActions');
    
    function InGameState(entityManager, resourceLoader)
    {
        this.entityManager = entityManager;
        this.resourceLoader = resourceLoader;

        
    }
    
    InGameState.prototype.enter = function()
    {
        // Setup a camera
        {
            var cameraEntity = this.entityManager.createEntity(['Transform', 'Camera', 'InputReceiver']);
            this.entityManager.addTag(cameraEntity, 'Camera');
            var camera = this.entityManager.getComponent(cameraEntity, 'Camera');
            camera.radius = 50.0;
            camera.lookAt = new THREE.Vector3(0, 0, 0);
            camera.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000.0);
        }

        // Setup processors.
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

        this.tilePickingProcessor = new TilePickingProcessor(this.entityManager);
        this.entityManager.registerProcessor(this.tilePickingProcessor);

        this.pickingProcessor = new PickingProcessor(this.entityManager);
        this.entityManager.registerProcessor(this.pickingProcessor);
        
        // Generate a new world every time.
        {
            this.worldGenerator = new WorldGenerator(this.entityManager, this.resourceLoader.get('grass'));
            this.world = this.worldGenerator.generateWorld({x: 8, y: 8}, 16);
        }
        
        this.menuProcessor = new MenuProcessor(this.entityManager, this.resourceLoader); 
        this.entityManager.registerProcessor(this.menuProcessor); 
        
        // Setup build processor (currently with dependency on world generator).
        this.buildProcessor = new BuildProcessor(this.entityManager, this.worldGenerator, this.resourceLoader);
        this.entityManager.registerProcessor(this.buildProcessor);
        
        
        
        // TEMPORARY: Setup a couple of stations.
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
        
        // TEMPORARY: Setup a vehicle that moves between the test stations.
        {
            this.vehicle1 = this.entityManager.createEntity(['Transform', 'Renderable', 'Vehicle', 'Inventory']);
            var transform = this.entityManager.getComponent(this.vehicle1, 'Transform');
            var renderable = this.entityManager.getComponent(this.vehicle1, 'Renderable');
            var vehicle = this.entityManager.getComponent(this.vehicle1, 'Vehicle');
            var inventory = this.entityManager.getComponent(this.vehicle1, 'Inventory');
            transform.position = new THREE.Vector3(0, 0, 0);
            vehicle.orders.push(new VehicleOrder(this.station1, VehicleActions.Load));
            vehicle.orders.push(new VehicleOrder(this.station2, VehicleActions.Unload));
            vehicle.orders.push(new VehicleOrder(this.station3, VehicleActions.Load));

            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
            renderable.mesh = new THREE.Mesh(geometry, material);
        }
        
        // TEMPORARY: Add the mining_structure
        /*
        var mining_structure = this.resourceLoader.get('mining_structure');
        mining_structure.scale.x = 0.5; 
        mining_structure.scale.y = 0.5; 
        mining_structure.scale.z = 0.5; 
        mining_structure.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 2)
        //mining_structure.
               
        this.renderingProcessor.scene.add(mining_structure);
        */ 
    };
    
    InGameState.prototype.exit = function()
    {
        
    };
    
    InGameState.prototype.update = function(ticker) 
    {
        this.entityManager.update();
    };
    
    return InGameState;
});