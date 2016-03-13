define(function (require) {
    "use strict";

    var THREE = require('THREE');
    var PickingEvent = require('Components/PickingEvent');
    var BuildStateEnum = require('Components/BuildStateEnum');

    function BuildProcessor(entityManager, worldGenerator) {
        this.entityManager = entityManager;
        this.worldGenerator = worldGenerator;


        this.stateEntity = this.entityManager.createEntity(['BuildState']);
        this.entityManager.addTag(this.stateEntity, 'BuildState');
        this.state = this.entityManager.getComponent(this.stateEntity, 'BuildState');
        this.state.state = BuildStateEnum.CONSTRUCTION;

        this.constructionProcessor = new ConstructionProcessor(entityManager, worldGenerator);


        this.tilePickedMessageFilter = this.entityManager.createEntityFilter(['TilePickedMessage']);

    }

    BuildProcessor.prototype.update = function ()
    {
        
        switch (this.state.state)
        {
            case BuildStateEnum.CONSTRUCTION: 
                this.constructionProcessor.update();
                break; 
        }

    };

    BuildProcessor.prototype.canPlaceObject = function (tileX, tileY)
    {
        var worldEntity = this.entityManager.getEntityByTag('World');
        var selectedEntity = this.entityManager.getEntityByTag('Selected');

        if (selectedEntity !== undefined) {
            var selected = this.entityManager.getComponent(selectedEntity, 'Selected');
            var world = this.entityManager.getComponent(worldEntity, 'World');

            var slope = this.checkSlope(world, tileX, tileY, tileX + selected.sideLength, tileY + selected.sideLength);
            if (slope === 0)
                return true;
            else
                return false;
        }
    };

    BuildProcessor.prototype.checkSlope = function (world, tileX, tileY, tileEndX, tileEndY)
    {
        var slope = 0;
        for (var y = tileY; y < tileEndY; y++) {
            for (var x = tileX; x < tileEndX; x++) {
                slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, x, y);
                if (slope !== 0)
                    return slope;
            }
        }

        return slope;
    };


    function ConstructionProcessor(entityManager, worldGenerator) {
        this.entityManager = entityManager;
        this.worldGenerator = worldGenerator;
        this.tilePickedMessageFilter = this.entityManager.createEntityFilter(['TilePickedMessage']);
        
        var selectedEntity = this.entityManager.getEntityByTag('Selected');
        var selected = this.entityManager.getComponent(selectedEntity, 'Selected');
        
        this.ghostObject = this.entityManager.createEntity(['Transform', 'Renderable']);
        var transform = this.entityManager.getComponent(this.ghostObject, 'Transform');
        var renderable = this.entityManager.getComponent(this.ghostObject, 'Renderable');
        transform.position = new THREE.Vector3(0, 0, 0);

        var geometry = new THREE.BoxGeometry(selected.sideLength, 1, selected.sideLength);
        var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }

    ConstructionProcessor.prototype.update = function () {
        for (var tilePickedMessage = this.tilePickedMessageFilter.first(); tilePickedMessage !== undefined; tilePickedMessage = this.tilePickedMessageFilter.next())
        {
            var tilePicked = this.entityManager.getComponent(tilePickedMessage, 'TilePickedMessage');
            switch (tilePicked.pickingEvent)
            {
                case PickingEvent.CLICK:
                    {
                        if (this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {

                            var selectedEntity = this.entityManager.getEntityByTag('Selected');
                            var selected = this.entityManager.getComponent(selectedEntity, 'Selected');

                            var object = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
                            var transform = this.entityManager.getComponent(object, 'Transform');
                            var renderable = this.entityManager.getComponent(object, 'Renderable');
                            var inventory = this.entityManager.getComponent(object, 'Inventory');
                            transform.position = new THREE.Vector3(tilePicked.tileX + selected.sideLength / 2, tilePicked.tileZ, tilePicked.tileY + selected.sideLength / 2);

                            inventory.currentLoad = 3000;
                            inventory.maxLoad = 3000;

                            var geometry = new THREE.BoxGeometry(1, 1, 1);
                            var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
                            renderable.mesh = new THREE.Mesh(geometry, material);
                        }
                    }
                    break;

                case PickingEvent.HOVER:
                    {
                        var selectedEntity = this.entityManager.getEntityByTag('Selected');
                        var selected = this.entityManager.getComponent(selectedEntity, 'Selected');

                        var transform = this.entityManager.getComponent(this.ghostObject, 'Transform');
                        var renderable = this.entityManager.getComponent(this.ghostObject, 'Renderable');
                        transform.position = new THREE.Vector3(tilePicked.tileX + selected.sideLength / 2, tilePicked.tileZ + selected.sideLength / 2, tilePicked.tileY + selected.sideLength / 2);

                        if (this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {
                            var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
                            renderable.mesh.material = material;
                        } else {
                            var material = new THREE.MeshLambertMaterial({color: 0xff0000});
                            renderable.mesh.material = material;
                        }
                    }
                    break;
            }
        }
    }
    
    ConstructionProcessor.prototype.canPlaceObject = function (tileX, tileY)
    {
        var worldEntity = this.entityManager.getEntityByTag('World');
        var selectedEntity = this.entityManager.getEntityByTag('Selected');

        if (selectedEntity !== undefined) {
            var selected = this.entityManager.getComponent(selectedEntity, 'Selected');
            var world = this.entityManager.getComponent(worldEntity, 'World');

            var slope = this.checkSlope(world, tileX, tileY, tileX + selected.sideLength, tileY + selected.sideLength);
            if (slope === 0)
                return true;
            else
                return false;
        }
    };

    ConstructionProcessor.prototype.checkSlope = function (world, tileX, tileY, tileEndX, tileEndY)
    {
        var slope = 0;
        for (var y = tileY; y < tileEndY; y++) {
            for (var x = tileX; x < tileEndX; x++) {
                slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, x, y);
                if (slope !== 0)
                    return slope;
            }
        }

        return slope;
    };


    return BuildProcessor;
});




