function InventoryStatusProcessor(entityManager, renderer)
{
    this.entityManager = entityManager;
    this.renderer = renderer;
	this.entityFilter = this.entityManager.createEntityFilter(['Inventory', 'Transform']);
}

InventoryStatusProcessor.prototype.update = function()
{
    for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next()) 
    {
        var transform = this.entityManager.getComponent(entity, 'Transform');
        var inventory = this.entityManager.getComponent(entity, 'Inventory');
        if(inventory.textEntity == -1)
        {
            inventory.textEntity = this.entityManager.createEntity(['Transform', 'Renderable']);
        }

        var textTransform = this.entityManager.getComponent(inventory.textEntity, 'Transform');
        textTransform.position = new THREE.Vector3(transform.position.x, transform.position.y + 2, transform.position.z);

        var textRenderable = this.entityManager.getComponent(inventory.textEntity, 'Renderable');
        this.renderer.scene.remove(textRenderable.mesh);
        textRenderable.mesh = this.renderer.getTextSprite((inventory.currentLoad / inventory.maxLoad * 100).toFixed(2) + '%');
        textRenderable.addedToScene = false;
    }
}
