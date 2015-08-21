function SpaceSettlers()
{
    this.entityManager = new ECS.EntityManager();
    this.entityManager.registerComponent('Transform', Transform);
    this.entityManager.registerComponent('Renderable', Renderable);
    
    this.renderingProcessor = new RenderingProcessor(this.entityManager);
    this.entityManager.registerProcessor(this.renderingProcessor, ['Transform', 'Renderable']);
    
    // Create a test box.
    {
        this.boxEntity = this.entityManager.createEntity(['Transform', 'Renderable']);
        var transform = this.entityManager.getComponent(this.boxEntity, 'Transform');
        var renderable = this.entityManager.getComponent(this.boxEntity, 'Renderable');
        transform.position = new THREE.Vector3(0, 5, 0);
        
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
        renderable.mesh = new THREE.Mesh(geometry, material);
    }
    
    this.ticker = new Ticker();
    this.ticker.start(this, this.update);
}

SpaceSettlers.prototype.update = function()
{
    this.entityManager.update();
}

var settlers = new SpaceSettlers();