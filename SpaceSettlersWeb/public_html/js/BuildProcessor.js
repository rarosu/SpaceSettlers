function BuildProcessor(entityManager) {
    this.entityManager = entityManager;
    this.tilePickedMessageFilter = this.entityManager.createEntityFilter(['TilePickedMessage']);
}

BuildProcessor.prototype.update = function() 
{
    for (var tilePickedMessage = this.tilePickedMessageFilter.first(); tilePickedMessage !== undefined; tilePickedMessage = this.tilePickedMessageFilter.next())
    {
        var tilePicked = this.entityManager.getComponent(tilePickedMessage, 'TilePickedMessage');
        switch (tilePicked.pickingEvent)
        {
            case PickingEvent.CLICK:
            {
                // TODO: Place the selected object at (tilePicked.tileX, tilePicked.tileY), if in build mode.
            } break;
            
            case PickingEvent.HOVER: 
            {
                // TODO: Highlight the tile in some fashion.
            } break;
        }   
    }
}; 

BuildProcessor.prototype.placeObject = function()
{
    this.selectedFilter = this.entityManager.createEntityFilter(['Selected', 'Transform']);
    var entity = this.selectedFilter.first(); 
    if(entity !== undefined) {
        var selectedTransform = this.entityManager.getComponent(entity, 'Transform'); 
        var selected = this.entityManager.getComponent(entity, 'Selected'); 
        
        this.chunkFilter = this.entityManager.createEntityFilter(['Transform', 'Renderable', 'Chunk', 'Pickable']);
        for (var chunkEntity = this.chunkFilter.first(); chunkEntity !== undefined; chunkEntity = this.chunkFilter.next()) 
        {
            var transform = this.entityManager.getComponent(chunkEntity, 'Transform'); 
            var chunk = this.entityManager.getComponent(chunkEntity, 'Chunk'); 
            // check if selected object is within this chunk 
            if(selectedTransform.position.x >= transform.position.x 
                    && selectedTransform.position.z >= transform.position.z
                    && selectedTransform.position.x < transform.position.x + chunk.size
                    && selectedTransform.position.z < transform.position.z + chunk.size)
            {
                
            }
        }
    }                            
}; 