function BuildProcessor(entityManager) {
    this.entityManager = entityManager;
}

BuildProcessor.prototype.update = function() 
{
    
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