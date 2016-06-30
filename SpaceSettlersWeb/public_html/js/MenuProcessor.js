define(function (require) {
    "use strict";

    var THREE = require('THREE');
    var BuildTypeEnum = require('Components/BuildTypeEnum');
    var BuildStateEnum = require('Components/BuildStateEnum');

    function MenuProcessor(entityManager, resourceLoader)
    {
        var _this = this;
        this.entityManager = entityManager;
        this.resourceLoader = resourceLoader;
        // stop the mouse down event to propagate to the canvas
        // when it happens over the menu
        $('.menu-container').mousedown(function (e) {
            e.stopImmediatePropagation();
        });

        /**
         * Create the menu items and populate properties
         * Then add a corresponding div in the html menu
         * 
         */
        {
            var dirtRoadMenuItemEntity = this.entityManager.createEntity(['MenuItem', 'Transform', 'Renderable']);
            var dirtRoadMenuItem = this.entityManager.getComponent(dirtRoadMenuItemEntity, 'MenuItem');
            dirtRoadMenuItem.icon = 'assets/icons/dirt-road-icon.png';
            dirtRoadMenuItem.type = BuildTypeEnum.DIRT_ROAD;
            dirtRoadMenuItem.buildState = BuildStateEnum.ROAD;
            dirtRoadMenuItem.sideLength = 1;

            var renderable = this.entityManager.getComponent(dirtRoadMenuItemEntity, 'Renderable');
            var geometry = new THREE.BoxGeometry(1, 0.1, 1);
            var material = new THREE.MeshLambertMaterial({color: 0xeeeeee});
            renderable.mesh = new THREE.Mesh(geometry, material);
            _this.entityManager.addTag(dirtRoadMenuItemEntity, 'Selected')
        }

        {
            var mining_structure = this.resourceLoader.get('mining_structure').clone();
            var ironMineMenuItemEntity = this.entityManager.createEntity(['MenuItem', 'Transform', 'Renderable']);
            var menuItem = this.entityManager.getComponent(ironMineMenuItemEntity, 'MenuItem');
            var renderable = this.entityManager.getComponent(ironMineMenuItemEntity, 'Renderable');
            var transform = this.entityManager.getComponent(ironMineMenuItemEntity, 'Transform');

            menuItem.icon = 'assets/icons/iron_mine_icon.png';
            menuItem.buildState = BuildStateEnum.CONSTRUCTION;
            menuItem.type = BuildTypeEnum.IRON_MINE;
            menuItem.sideLength = 2;
            transform.orientation = mining_structure.quaternion;
            renderable.mesh = mining_structure;
        }


        this.entityFilter = this.entityManager.createEntityFilter(['MenuItem']);
        for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next())
        {
            var menuItem = this.entityManager.getComponent(entity, 'MenuItem');

            // use a closure here to make sure the click event of the menu item has access to 
            // the variables from the for loop at the moment the closure is created (instead of the 
            // variables as they would be at the last iteration of the for loop). 
            (function () {
                var menuItemDiv = document.createElement('div');
                var _entity = entity;
                $(menuItemDiv).addClass('menu-item')
                        .append('<img src="' + menuItem.icon + '"/>')
                        .appendTo($('.menu-container'))
                        .mousedown(function (e) {
                            e.stopImmediatePropagation();
                        })
                        .click(function (e) {
                            e.stopImmediatePropagation();

                            {
                                var selectedEntity = _this.entityManager.getEntityByTag('Selected');
                                var renderable = _this.entityManager.getComponent(selectedEntity, 'Renderable');
                                renderable.removeFromScene = true;
                            }
                            {                               
                                var renderable = _this.entityManager.getComponent(_entity, 'Renderable');
                                renderable.removeFromScene = false;
                            }
                            
                            _this.entityManager.removeTag('Selected');
                            _this.entityManager.addTag(_entity, 'Selected')

                        });
            })();

        }


    }

    MenuProcessor.prototype.update = function ()
    {

    }

    return MenuProcessor;
}); 