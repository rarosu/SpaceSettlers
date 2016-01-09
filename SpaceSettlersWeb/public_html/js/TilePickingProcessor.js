function TilePickingProcessor(entityManager) 
{
    this.entityManager = entityManager;
    this.pickingMessageFilter = this.entityManager.createEntityFilter(['PickingMessage']);
}

TilePickingProcessor.prototype.update = function() 
{
    var worldEntity = this.entityManager.getEntityByTag('World');
    var world = this.entityManager.getComponent(worldEntity, 'World');
    var firstChunkTransform = this.entityManager.getComponent(world.chunks[0], 'Transform');
    
    for (var pickingMessage = this.pickingMessageFilter.first(); pickingMessage !== undefined; pickingMessage = this.pickingMessageFilter.next())
    {
        var picking = this.entityManager.getComponent(pickingMessage, 'PickingMessage');
        var chunk = this.entityManager.getComponent(picking.entity, 'Chunk');
        if (chunk !== undefined)
        {
            var dx = picking.intersectionPoint.x - firstChunkTransform.position.x;
            var dy = picking.intersectionPoint.y - firstChunkTransform.position.y;
            var dz = picking.intersectionPoint.z - firstChunkTransform.position.z;

            var tilePickedMessage = this.entityManager.createMessage(this, ['TilePickedMessage']);
            var tilePicked = this.entityManager.getComponent(tilePickedMessage, 'TilePickedMessage');
            tilePicked.tileX = Math.floor(dx);
            tilePicked.tileY = Math.floor(dz);
            tilePicked.tileZ = Math.floor(dy);
            
            tilePicked.pickingEvent = picking.pickingEvent;
        }
    }
};

