function InventoryStatusProcessor(entityManager, renderer)
{
    this.entityManager = entityManager;
    this.renderer = renderer;
}

InventoryStatusProcessor.prototype.update = function()
{
    var entities = this.entityManager.getEntitiesByProcessor(this);
    for(var i = 0; i<entities.length; i++)
    {
        var transform = this.entityManager.getComponent(entities[i], 'Transform');
        var inventory = this.entityManager.getComponent(entities[i], 'Inventory');
        if(inventory.textEntity == -1)
        {
            inventory.textEntity = this.entityManager.createEntity(['Transform', 'Renderable']);

        }

        var textTransform = this.entityManager.getComponent(inventory.textEntity, 'Transform');
        textTransform.position = new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z);


        var textRenderable = this.entityManager.getComponent(inventory.textEntity, 'Renderable');
        this.renderer.scene.remove(textRenderable.mesh);
        textRenderable.mesh = this.renderer.getTextSprite(inventory.currentLoad / inventory.maxLoad * 100 + '%');
        textRenderable.addedToScene = false;

    }
}
