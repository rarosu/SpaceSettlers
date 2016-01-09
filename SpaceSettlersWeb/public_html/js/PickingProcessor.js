function PickingProcessor(entityManager) {
    this.entityManager = entityManager;
    this.entityFilter = this.entityManager.createEntityFilter(['Transform', 'Renderable', 'Pickable']);
    this.lastClickX = 0;
    this.lastClickY = 0;
    //this.projector = new THREE.Projector();

    var _this = this;
    $(document).mousedown(function(e) {
        _this.lastClickX = e.clientX;
        _this.lastClickY = e.clientY;

        var cameraEntity = _this.entityManager.getEntityByTag('Camera');
        var camera = _this.entityManager.getComponent(cameraEntity, 'Camera');

        var ndcX = (_this.lastClickX / window.innerWidth) * 2.0 - 1.0;
        var ndcY = 1.0 - (_this.lastClickY / window.innerHeight) * 2.0;
        //var target = this.projector.unprojectVector(new THREE.Vector3(ndcX, ndcY, 0.5), camera.camera);
        var raycaster = new THREE.Raycaster();
        //raycaster.set(camera.camera.position, target.sub(camera.camera.position).normalize());
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera.camera);

        for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next()) {
            var transform = _this.entityManager.getComponent(entity, 'Transform');
            var renderable = _this.entityManager.getComponent(entity, 'Renderable');
            var pickable = _this.entityManager.getComponent(entity, 'Pickable');

            var intersections = raycaster.intersectObject(renderable.mesh, false);
            if (intersections.length !== 0) {
                console.log('intersecting with object ' + entity);
                var pickingMessage = _this.entityManager.createMessage(_this, ['PickingMessage']);
                var picking = _this.entityManager.getComponent(pickingMessage, 'PickingMessage');
                picking.entity = entity;
            }
        }
    });
}

PickingProcessor.prototype.update = function() {

};
