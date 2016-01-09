function BuildProcessor(entityManager, worldGenerator) {
    this.entityManager = entityManager;
    this.worldGenerator = worldGenerator; 
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
                if(this.canPlaceObject(tilePicked.tileX, tilePicked.tileY)) {
                    var object = this.entityManager.createEntity(['Transform', 'Renderable', 'Inventory']);
                    var transform = this.entityManager.getComponent(object, 'Transform');
                    var renderable = this.entityManager.getComponent(object, 'Renderable');
                    var inventory = this.entityManager.getComponent(object, 'Inventory');
                    transform.position = new THREE.Vector3(tilePicked.tileX, tilePicked.tileZ, tilePicked.tileY);

                    inventory.currentLoad = 3000;
                    inventory.maxLoad = 3000;

                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    var material = new THREE.MeshLambertMaterial({color: 0x0000ff});
                    renderable.mesh = new THREE.Mesh(geometry, material);
                }                    
            } break;
            
            case PickingEvent.HOVER: 
            {
                // TODO: Highlight the tile in some fashion.                
            } break;
        }   
    }
}; 

BuildProcessor.prototype.canPlaceObject = function(tileX, tileY)
{
    var selectedFilter = this.entityManager.createEntityFilter(['Selected', 'Transform']);
    var worldEntity = this.entityManager.getEntityByTag('World'); 
    
    var entity = selectedFilter.first(); 
    if(entity !== undefined) {
        var selected = this.entityManager.getComponent(entity, 'Selected'); 
        var world = this.entityManager.getComponent(worldEntity, 'World');
        
        var slope = this.checkSlope(world, tileX, tileY, tileX + selected.sideLength, tileY + selected.sideLength); 
        if(slope === 0)
            return true; 
        else 
            return false; 
    }                            
};

BuildProcessor.prototype.checkSlope = function(world, tileX, tileY, tileEndX, tileEndY)
{
    var slope = 0; 
    for(var y = tileY; y < tileEndY; y++) {
        for(var x = tileX; x < tileEndX; x++) {
            slope = this.worldGenerator.getSlope(world.heightmap, world.worldWidth, x, y); 
            if(slope !== 0)
                return slope; 
        }
    }
    
    return slope; 
}; 