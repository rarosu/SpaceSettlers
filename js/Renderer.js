function RenderingProcessor(entityManager)
{
    this.entityManager = entityManager;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    // Hard-coded camera. This should probably be moved into a tagged entity.
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    this.camera.position.set(0, -1, 5);
    
    // Hard-coded light for the time being.
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
}

RenderingProcessor.prototype.update = function()
{
    this.camera.lookAt(new THREE.Vector3().addVectors(this.camera.position, new THREE.Vector3(0, 0, -1)));
    
    var entities = this.entityManager.getEntitiesByProcessor(this);
    for (var i = 0; i < entities.length; i++)
    {
        var transform = this.entityManager.getComponent(entities[i], 'Transform');
        var renderable = this.entityManager.getComponent(entities[i], 'Renderable');
        
        if (renderable.mesh)
        {
            renderable.mesh.position = transform.position;
            renderable.mesh.quaternion = transform.orientation;
            
            if (!renderable.addedToScene)
            {
                this.scene.add(renderable.mesh);
                renderable.addedToScene = true;
            }
        }
    }
    
    this.renderer.render(this.scene, this.camera);
}