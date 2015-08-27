function RenderingProcessor(entityManager)
{
    this.entityManager = entityManager;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Hard-coded light for the time being.
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
}

RenderingProcessor.prototype.update = function()
{
    var entities = this.entityManager.getEntitiesByProcessor(this);
    for (var i = 0; i < entities.length; i++)
    {
        var transform = this.entityManager.getComponent(entities[i], 'Transform');
        var renderable = this.entityManager.getComponent(entities[i], 'Renderable');

        if (renderable.mesh)
        {
            renderable.mesh.position.copy(transform.position);
            renderable.mesh.quaternion = transform.orientation;

            if (!renderable.addedToScene)
            {
                this.scene.add(renderable.mesh);
                renderable.addedToScene = true;
            }
        }
    }

    var cameraEntity = this.entityManager.getEntityByTag('Camera');
    var camera = this.entityManager.getComponent(cameraEntity, 'Camera');

    this.renderer.render(this.scene, camera.camera);
}
