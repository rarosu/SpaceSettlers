define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    var PickingEvent = require('Components/PickingEvent');
    
    function PickingProcessor(entityManager) {
        this.entityManager = entityManager;
        this.entityFilter = this.entityManager.createEntityFilter(['Transform', 'Renderable', 'Pickable']);
        this.raycaster = new THREE.Raycaster();

        var _this = this;
        document.addEventListener('mousedown', function(e) {
            // Handle picking by clicking.
            _this.emitPickingMessage(e.clientX, e.clientY, PickingEvent.CLICK);
        });

        document.addEventListener('mousemove', function(e) {
            // Handle picking by hovering.
            _this.emitPickingMessage(e.clientX, e.clientY, PickingEvent.HOVER);
        });
    }

    PickingProcessor.prototype.emitPickingMessage = function(screenX, screenY, pickingEvent)
    {
        var cameraEntity = this.entityManager.getEntityByTag('Camera');
        var camera = this.entityManager.getComponent(cameraEntity, 'Camera');

        var ndcX = (screenX / window.innerWidth) * 2.0 - 1.0;
        var ndcY = 1.0 - (screenY / window.innerHeight) * 2.0;

        this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera.camera);

        for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next()) 
        {
            // Make sure this picking event is applicable to this entity.
            var pickable = this.entityManager.getComponent(entity, 'Pickable');
            if ((pickable.pickingEvent & pickingEvent) === 0)
                continue;

            // Intersect versus the mesh and emit a message if success.
            var renderable = this.entityManager.getComponent(entity, 'Renderable');
            var intersections = this.raycaster.intersectObject(renderable.mesh, false);
            if (intersections.length !== 0) 
            {
                var pickingMessage = this.entityManager.createMessage(this, ['PickingMessage']);
                var picking = this.entityManager.getComponent(pickingMessage, 'PickingMessage');

                picking.entity = entity;
                picking.pickingEvent = pickingEvent;
                picking.intersectionPoint = intersections[0].point;
            }
        }
    };

    PickingProcessor.prototype.update = function() {

    };
    
    return PickingProcessor;
});


