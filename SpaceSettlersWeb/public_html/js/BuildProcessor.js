define(function (require) {
    "use strict";

    var THREE = require('THREE');
    var PickingEvent = require('Components/PickingEvent');
    var BuildStateEnum = require('Components/BuildStateEnum');

    function BuildProcessor(entityManager, worldGenerator, resourceLoader) {
        this.entityManager = entityManager;
        this.worldGenerator = worldGenerator;
        this.resourceLoader = resourceLoader;


        var selectedEntity = this.entityManager.getEntityByTag('Selected');
        this.selected = this.entityManager.getComponent(selectedEntity, 'MenuItem');

        this.constructionProcessor = new ConstructionProcessor(entityManager, worldGenerator);
        this.roadConstructionProcessor = new RoadConstructionProcessor(entityManager, worldGenerator, resourceLoader);
    }

    BuildProcessor.prototype.update = function ()
    {
        var selectedEntity = this.entityManager.getEntityByTag('Selected');
        this.selected = this.entityManager.getComponent(selectedEntity, 'MenuItem');
        switch (this.selected.buildState)
        {
            case BuildStateEnum.CONSTRUCTION:
                this.constructionProcessor.update();
                break;
            case BuildStateEnum.ROAD:
                this.roadConstructionProcessor.update();
                break;
        }

    };


    function ConstructionProcessor(entityManager, worldGenerator) {
        this.entityManager = entityManager;
        this.worldGenerator = worldGenerator;
        this.tilePickedMessageFilter = this.entityManager.createEntityFilter(['TilePickedMessage']);
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
                            var menuItem = this.entityManager.getComponent(selectedEntity, 'MenuItem');
                            var selectedRenderable = this.entityManager.getComponent(selectedEntity, 'Renderable');

                            var object = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
                            var transform = this.entityManager.getComponent(object, 'Transform');
                            var renderable = this.entityManager.getComponent(object, 'Renderable');
                            var inventory = this.entityManager.getComponent(object, 'Inventory');
                            transform.position = new THREE.Vector3(tilePicked.tileX + menuItem.sideLength / 2, tilePicked.tileZ, tilePicked.tileY + menuItem.sideLength / 2);
                            transform.orientation = selectedRenderable.mesh.quaternion;
                            inventory.currentLoad = 3000;
                            inventory.maxLoad = 3000;

                            renderable.mesh = selectedRenderable.mesh.clone();
                        }
                    }
                    break;

                case PickingEvent.HOVER:
                    {
                        var selectedEntity = this.entityManager.getEntityByTag('Selected');
                        var menuItem = this.entityManager.getComponent(selectedEntity, 'MenuItem');
                        var transform = this.entityManager.getComponent(selectedEntity, 'Transform');
                        var renderable = this.entityManager.getComponent(selectedEntity, 'Renderable');
                        transform.position = new THREE.Vector3(tilePicked.tileX + menuItem.sideLength / 2, tilePicked.tileZ + menuItem.sideLength / 2, tilePicked.tileY + menuItem.sideLength / 2);
                        
                /*if (this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {
                            renderable.mesh = selected.mesh;
                        } else {
                            renderable.mesh = selected.mesh;
                        }*/ 
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
            var selected = this.entityManager.getComponent(selectedEntity, 'MenuItem');
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


    function RoadConstructionProcessor(entityManager, worldGenerator, resourceLoader) {
        this.entityManager = entityManager;
        this.worldGenerator = worldGenerator;
        this.resourceLoader = resourceLoader;
        this.tilePickedMessageFilter = this.entityManager.createEntityFilter(['TilePickedMessage']);

        var selectedEntity = this.entityManager.getEntityByTag('Selected');
        var selected = this.entityManager.getComponent(selectedEntity, 'MenuItem');
    }

    RoadConstructionProcessor.prototype.update = function () {
        var texture = this.resourceLoader.get('road_dirt');
        for (var tilePickedMessage = this.tilePickedMessageFilter.first(); tilePickedMessage !== undefined; tilePickedMessage = this.tilePickedMessageFilter.next())
        {
            
            var tilePicked = this.entityManager.getComponent(tilePickedMessage, 'TilePickedMessage');
            switch (tilePicked.pickingEvent)
            {
                case PickingEvent.CLICK:
                    {
                        if (this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {

                            var selectedEntity = this.entityManager.getEntityByTag('Selected');
                            var selected = this.entityManager.getComponent(selectedEntity, 'MenuItem');
                            var worldEntity = this.entityManager.getEntityByTag('World');

                            var object = this.entityManager.createEntity(['Transform', 'Renderable']);
                            var transform = this.entityManager.getComponent(object, 'Transform');
                            var renderable = this.entityManager.getComponent(object, 'Renderable');
                            transform.position = new THREE.Vector3(tilePicked.tileX, tilePicked.tileZ + 0.01, tilePicked.tileY);

                            // TODO mesh and properties should be provided by selected item

                            
                            var world = this.entityManager.getComponent(worldEntity, 'World');
                            var slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, tilePicked.tileX, tilePicked.tileY);
                            var nw = slope & this.worldGenerator.SLOPE_NW ? 1 : 0;
                            var ne = slope & this.worldGenerator.SLOPE_NE ? 1 : 0;
                            var sw = slope & this.worldGenerator.SLOPE_SW ? 1 : 0;
                            var se = slope & this.worldGenerator.SLOPE_SE ? 1 : 0;

                            var positions = new Float32Array(6 * 3);
                            var texcoords = new Float32Array(6 * 2);
                            var normals = new Float32Array(6 * 3);
                            var step = 1.0;

                            if (slope == this.worldGenerator.SLOPE_NE || slope == this.worldGenerator.SLOPE_SW)
                            {
                                positions[0] = 0;
                                positions[1] = nw;
                                positions[2] = 0;

                                positions[3] = 0;
                                positions[4] = sw;
                                positions[5] = 1;

                                positions[6] = 1;
                                positions[7] = se;
                                positions[8] = 1;


                                positions[9] = 1;
                                positions[10] = se;
                                positions[11] = 1;

                                positions[12] = 1;
                                positions[13] = ne;
                                positions[14] = 0;

                                positions[15] = 0;
                                positions[16] = nw;
                                positions[17] = 0;

                                texcoords[0] = 0;
                                texcoords[1] = 0;
                                texcoords[2] = 0;
                                texcoords[3] = step;
                                texcoords[4] = step;
                                texcoords[5] = step;

                                texcoords[6] = step;
                                texcoords[7] = step;
                                texcoords[8] = step;
                                texcoords[9] = 0;
                                texcoords[10] = 0;
                                texcoords[11] = 0;

                                var p1 = new THREE.Vector3(0, nw, 0);
                                var p2 = new THREE.Vector3(0, sw, 1);
                                var p3 = new THREE.Vector3(1, se, 1);
                                var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                                normals[0] = n.x;
                                normals[1] = n.y;
                                normals[2] = n.z;

                                normals[3] = n.x;
                                normals[4] = n.y;
                                normals[5] = n.z;

                                normals[6] = n.x;
                                normals[7] = n.y;
                                normals[8] = n.z;


                                p1 = new THREE.Vector3(1, se, 1);
                                p2 = new THREE.Vector3(1, ne, 0);
                                p3 = new THREE.Vector3(0, nw, 0);
                                n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                                normals[9] = n.x;
                                normals[10] = n.y;
                                normals[11] = n.z;

                                normals[12] = n.x;
                                normals[13] = n.y;
                                normals[14] = n.z;

                                normals[15] = n.x;
                                normals[16] = n.y;
                                normals[17] = n.z;


                            } else
                            {
                                positions[0] = 0;
                                positions[1] = nw;
                                positions[2] = 0;

                                positions[3] = 0;
                                positions[4] = sw;
                                positions[5] = 1;

                                positions[6] = 1;
                                positions[7] = ne;
                                positions[8] = 0;


                                positions[9] = 0;
                                positions[10] = sw;
                                positions[11] = 1;

                                positions[12] = 1;
                                positions[13] = se;
                                positions[14] = 1;

                                positions[15] = 1;
                                positions[16] = ne;
                                positions[17] = 0;

                                texcoords[0] = 0;
                                texcoords[1] = 0;
                                texcoords[2] = 0;
                                texcoords[3] = step;
                                texcoords[4] = step;
                                texcoords[5] = 0;

                                texcoords[6] = 0;
                                texcoords[7] = step;
                                texcoords[8] = step;
                                texcoords[9] = step;
                                texcoords[10] = step;
                                texcoords[11] = 0;

                                var p1 = new THREE.Vector3(0, nw, 0);
                                var p2 = new THREE.Vector3(0, sw, 1);
                                var p3 = new THREE.Vector3(1, ne, 0);
                                var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                                normals[0] = n.x;
                                normals[1] = n.y;
                                normals[2] = n.z;

                                normals[3] = n.x;
                                normals[4] = n.y;
                                normals[5] = n.z;

                                normals[6] = n.x;
                                normals[7] = n.y;
                                normals[8] = n.z;


                                p1 = new THREE.Vector3(0, sw, 1);
                                p2 = new THREE.Vector3(1, se, 1);
                                p3 = new THREE.Vector3(1, ne, 0);
                                n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                                normals[9] = n.x;
                                normals[10] = n.y;
                                normals[11] = n.z;

                                normals[12] = n.x;
                                normals[13] = n.y;
                                normals[14] = n.z;

                                normals[15] = n.x;
                                normals[16] = n.y;
                                normals[17] = n.z;
                            }

                            var geometry = new THREE.BufferGeometry();
                            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                            geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
                            geometry.addAttribute('uv', new THREE.BufferAttribute(texcoords, 2));
                            var material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, map: texture});
                            renderable.mesh = new THREE.Mesh(geometry, material);
                        }
                    }
                    break;

                case PickingEvent.HOVER:
                    {
                        var selectedEntity = this.entityManager.getEntityByTag('Selected');
                        var menuItem = this.entityManager.getComponent(selectedEntity, 'MenuItem');
                        var transform = this.entityManager.getComponent(selectedEntity, 'Transform');
                        var renderable = this.entityManager.getComponent(selectedEntity, 'Renderable');

                        var worldEntity = this.entityManager.getEntityByTag('World');

                        transform.position = new THREE.Vector3(tilePicked.tileX, tilePicked.tileZ + 0.1, tilePicked.tileY);

                        var world = this.entityManager.getComponent(worldEntity, 'World');
                        var slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, tilePicked.tileX, tilePicked.tileY);
                        var nw = slope & this.worldGenerator.SLOPE_NW ? 1 : 0;
                        var ne = slope & this.worldGenerator.SLOPE_NE ? 1 : 0;
                        var sw = slope & this.worldGenerator.SLOPE_SW ? 1 : 0;
                        var se = slope & this.worldGenerator.SLOPE_SE ? 1 : 0;

                        var positions = new Float32Array(6 * 3);
                        var texcoords = new Float32Array(6 * 2);
                        var normals = new Float32Array(6 * 3);

                        var step = 1.0;

                        if (slope == this.worldGenerator.SLOPE_NE || slope == this.worldGenerator.SLOPE_SW)
                        {
                            positions[0] = 0;
                            positions[1] = nw;
                            positions[2] = 0;

                            positions[3] = 0;
                            positions[4] = sw;
                            positions[5] = 1;

                            positions[6] = 1;
                            positions[7] = se;
                            positions[8] = 1;


                            positions[9] = 1;
                            positions[10] = se;
                            positions[11] = 1;

                            positions[12] = 1;
                            positions[13] = ne;
                            positions[14] = 0;

                            positions[15] = 0;
                            positions[16] = nw;
                            positions[17] = 0;

                            texcoords[0] = 0;
                            texcoords[1] = 0;
                            texcoords[2] = 0;
                            texcoords[3] = step;
                            texcoords[4] = step;
                            texcoords[5] = step;

                            texcoords[6] = step;
                            texcoords[7] = step;
                            texcoords[8] = step;
                            texcoords[9] = 0;
                            texcoords[10] = 0;
                            texcoords[11] = 0;

                            var p1 = new THREE.Vector3(0, nw, 0);
                            var p2 = new THREE.Vector3(0, sw, 1);
                            var p3 = new THREE.Vector3(1, se, 1);
                            var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                            normals[0] = n.x;
                            normals[1] = n.y;
                            normals[2] = n.z;

                            normals[3] = n.x;
                            normals[4] = n.y;
                            normals[5] = n.z;

                            normals[6] = n.x;
                            normals[7] = n.y;
                            normals[8] = n.z;


                            p1 = new THREE.Vector3(1, se, 1);
                            p2 = new THREE.Vector3(1, ne, 0);
                            p3 = new THREE.Vector3(0, nw, 0);
                            n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                            normals[9] = n.x;
                            normals[10] = n.y;
                            normals[11] = n.z;

                            normals[12] = n.x;
                            normals[13] = n.y;
                            normals[14] = n.z;

                            normals[15] = n.x;
                            normals[16] = n.y;
                            normals[17] = n.z;

                        } else
                        {
                            positions[0] = 0;
                            positions[1] = nw;
                            positions[2] = 0;

                            positions[3] = 0;
                            positions[4] = sw;
                            positions[5] = 1;

                            positions[6] = 1;
                            positions[7] = ne;
                            positions[8] = 0;


                            positions[9] = 0;
                            positions[10] = sw;
                            positions[11] = 1;

                            positions[12] = 1;
                            positions[13] = se;
                            positions[14] = 1;

                            positions[15] = 1;
                            positions[16] = ne;
                            positions[17] = 0;

                            texcoords[0] = 0;
                            texcoords[1] = 0;
                            texcoords[2] = 0;
                            texcoords[3] = step;
                            texcoords[4] = step;
                            texcoords[5] = 0;

                            texcoords[6] = 0;
                            texcoords[7] = step;
                            texcoords[8] = step;
                            texcoords[9] = step;
                            texcoords[10] = step;
                            texcoords[11] = 0;

                            var p1 = new THREE.Vector3(0, nw, 0);
                            var p2 = new THREE.Vector3(0, sw, 1);
                            var p3 = new THREE.Vector3(1, ne, 0);
                            var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                            normals[0] = n.x;
                            normals[1] = n.y;
                            normals[2] = n.z;

                            normals[3] = n.x;
                            normals[4] = n.y;
                            normals[5] = n.z;

                            normals[6] = n.x;
                            normals[7] = n.y;
                            normals[8] = n.z;


                            p1 = new THREE.Vector3(0, sw, 1);
                            p2 = new THREE.Vector3(1, se, 1);
                            p3 = new THREE.Vector3(1, ne, 0);
                            n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                            normals[9] = n.x;
                            normals[10] = n.y;
                            normals[11] = n.z;

                            normals[12] = n.x;
                            normals[13] = n.y;
                            normals[14] = n.z;

                            normals[15] = n.x;
                            normals[16] = n.y;
                            normals[17] = n.z;
                        }
                        if (this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {

                            var geometry = new THREE.BufferGeometry();
                            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                            geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
                            geometry.addAttribute('uv', new THREE.BufferAttribute(texcoords, 2));
                            var material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, map: texture});
                            geometry.verticesNeedUpdate = true;
                            geometry.colorsNeedUpdate = true;
                            renderable.mesh.material = material;
                            renderable.mesh.geometry = geometry;
                        } else {
                            var geometry = new THREE.BufferGeometry();
                            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                            var material = new THREE.MeshLambertMaterial({color: 0xff0000});
                            geometry.verticesNeedUpdate = true;
                            geometry.colorsNeedUpdate = true;
                            renderable.mesh.material = material;
                            renderable.mesh.geometry = geometry;
                        }
                    }
                    break;
                case PickingEvent.RIGHTCLICK:

                    break;
            }
        }
    }

    RoadConstructionProcessor.prototype.canPlaceObject = function (tileX, tileY)
    {
        var worldEntity = this.entityManager.getEntityByTag('World');
        var selectedEntity = this.entityManager.getEntityByTag('Selected');

        if (selectedEntity !== undefined) {
            var world = this.entityManager.getComponent(worldEntity, 'World');
            var slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, tileX, tileY);
            if (slope & this.worldGenerator.SLOPE_NW && slope & this.worldGenerator.SLOPE_NE && !(slope & this.worldGenerator.SLOPE_SE) && !(slope & this.worldGenerator.SLOPE_SW)
                    || slope & this.worldGenerator.SLOPE_SW && slope & this.worldGenerator.SLOPE_SE && !(slope & this.worldGenerator.SLOPE_NE) && !(slope & this.worldGenerator.SLOPE_NW)
                    || slope & this.worldGenerator.SLOPE_NW && slope & this.worldGenerator.SLOPE_SW && !(slope & this.worldGenerator.SLOPE_SE) && !(slope & this.worldGenerator.SLOPE_NE)
                    || slope & this.worldGenerator.SLOPE_NE && slope & this.worldGenerator.SLOPE_SE && !(slope & this.worldGenerator.SLOPE_NW) && !(slope & this.worldGenerator.SLOPE_SW)
                    || slope === this.worldGenerator.SLOPE_FLAT)
                return true;
            else
                return false;
        }
    };


    return BuildProcessor;
});




