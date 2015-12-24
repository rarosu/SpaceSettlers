function CameraProcessor(entityManager)
{
    this.entityManager = entityManager;
}

CameraProcessor.prototype.update = function()
{
    var cameraEntity = this.entityManager.getEntityByTag('Camera');
    if (cameraEntity !== undefined)
    {
        var transform = this.entityManager.getComponent(cameraEntity, 'Transform');
        var camera = this.entityManager.getComponent(cameraEntity, 'Camera');
        var inputReceiver = this.entityManager.getComponent(cameraEntity, 'InputReceiver');

        var dtheta = 0;
        var dphi = 0;
        if (inputReceiver.currentState.buttons.left &&
            inputReceiver.previousState.buttons.left)
        {
            // Orbit the camera.
            var dx = inputReceiver.currentState.mousePosition.x - inputReceiver.previousState.mousePosition.x;
            var dy = inputReceiver.currentState.mousePosition.y - inputReceiver.previousState.mousePosition.y;
            dtheta = dx * 0.01;
            dphi = dy * 0.01;
        }

        var offset = new THREE.Vector3();
        offset.copy(camera.camera.position).sub(camera.lookAt);

        var theta = Math.atan2(offset.z, offset.x);
        var phi = Math.asin(offset.y / camera.radius);

        theta += dtheta;
        phi += dphi;
        var epsilon = 0.01;
        var min_phi = Math.PI * 0.5 * 0.33;
        if (phi < min_phi) phi = min_phi;
        if (phi > Math.PI * 0.5 - epsilon) phi = Math.PI * 0.5 - epsilon;


        var h = camera.radius * Math.cos(phi);
        var x = h * Math.cos(theta);
        var y = camera.radius * Math.sin(phi);
        var z = h * Math.sin(theta);

        offset.x = x;
        offset.y = y;
        offset.z = z;


        camera.camera.position.copy(camera.lookAt).add(offset);
        camera.camera.lookAt(camera.lookAt);

        transform.position.copy(camera.camera.position);
        transform.orientation.copy(camera.camera.quaternion);
    }
};
