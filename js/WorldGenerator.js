function WorldGenerator(entityManager)
{
    this.entityManager = entityManager;
}

WorldGenerator.prototype.generateWorld = function(chunkCount, chunkSize)
{
    var heightmap = this.generateTestHillHeightmap(chunkCount, chunkSize);
    var slopemap = this.generateSlopemap(chunkCount, chunkSize, heightmap);

    var chunks = [];
    for (var y = 0; y < chunkCount.y; y++)
    {
        for (var x = 0; x < chunkCount.x; x++)
        {
            var index = y * chunkCount.x + x;
            chunks[index] = this.generateChunk(x, y, chunkSize, chunkCount, heightmap, slopemap);
        }
    }

    var world = this.entityManager.createEntity(['World']);
    var worldComponent = this.entityManager.getComponent(world, 'World');
    worldComponent.chunks = chunks;

    return world;
}

WorldGenerator.prototype.generateTestHillHeightmap = function(chunkCount, chunkSize)
{
    var worldWidth = chunkCount.x * chunkSize;
    var worldHeight = chunkCount.y * chunkSize;
    var heightmap = new Array(worldWidth * worldHeight);

    for (var y = 0; y < worldHeight; ++y)
    {
        for (var x = 0; x < worldWidth; ++x)
        {
            heightmap[y * worldWidth + x] = 0;
        }
    }

    function setHeightIfGreater(x, y, height)
    {
        var index = y * worldWidth + x;
        heightmap[index] = Math.max(heightmap[index], height);
    }

    function generateHill(x, y)
    {
        setHeightIfGreater(x, y, 2);
        setHeightIfGreater(x + 1, y, 1);
        setHeightIfGreater(x - 1, y, 1);
        setHeightIfGreater(x, y + 1, 1);
        setHeightIfGreater(x + 1, y + 1, 1);
        setHeightIfGreater(x - 1, y + 1, 1);
        setHeightIfGreater(x, y - 1, 1);
        setHeightIfGreater(x + 1, y - 1, 1);
        setHeightIfGreater(x - 1, y - 1, 1);
    }

    var centerX = worldWidth / 2;
    var centerY = worldHeight / 2;
    generateHill(centerX, centerY);
    generateHill(centerX - 1, centerY + 1);
    generateHill(centerX + 1, centerY - 1);
    

    return heightmap;
};

WorldGenerator.prototype.generateHeightmap = function(chunkCount, chunkSize)
{
    var worldWidth = chunkCount.x * chunkSize;
    var worldHeight = chunkCount.y * chunkSize;
    var heightmap = new Array(worldWidth * worldHeight);

    var permutations = Simplex.randomPermutations();
    var frequencyScale = 0.01;
    var amplitudeScale = 12.0;
    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
            var height = Math.floor(amplitudeScale * Simplex.simplex2d(x * frequencyScale, y * frequencyScale, permutations));
            var index = y * worldWidth + x;

            heightmap[index] = height;
        }
    }
    
    //this.correctHeights(chunkCount, chunkSize, heightmap, 0); 
    
 
    // DEBUG ASSERT
    /*
    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
            var index = y * worldWidth + x;
            for (var offsetY = -1; offsetY <= 1; offsetY++)
            {
                for (var offsetX = -1; offsetX <= 1; offsetX++)
                {
                    if (offsetX == 0 && offsetY == 0)
                        continue;
                    var neighborX = x + offsetX;
                    var neighborY = y + offsetY;
                    var neighborIndex = neighborY * worldWidth + neighborX;
                    if (neighborX < 0 || neighborX >= worldWidth)
                        continue;
                    if (neighborY < 0 || neighborY >= worldHeight)
                        continue;

                    var neighborHeight = heightmap[neighborIndex];
                    var height = heightmap[index];
                    if (Math.abs(height - neighborHeight) > 1)
                        console.log("Error: Two neighboring tiles have more than 2 in height difference");
                }
            }
        }
    }
    */ 
    // /DEBUG

    return heightmap;
}

WorldGenerator.prototype.correctHeights = function(chunkCount, chunkSize, heightmap, rec) 
{
    var worldWidth = chunkCount.x * chunkSize;
    var worldHeight = chunkCount.y * chunkSize;
    
    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
             var index = y * worldWidth + x;
             var height = heightmap[index];
           
            var neighborHeight = heightmap[y * worldWidth + (x - 1)];
            if (x - 1 >= 0)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            neighborHeight = heightmap[y * worldWidth + (x + 1)];
            if (x + 1 < worldWidth)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            neightborHeight = heightmap[(y - 1) * worldWidth + x];
            if (y - 1 >= 0)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            neightborHeight = heightmap[(y + 1) * worldWidth + x];
            if (y + 1 < worldHeight)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            
            neightborHeight = heightmap[(y + 1) * worldWidth + (x + 1)];
            if (y + 1 < worldHeight && x + 1 < worldWidth)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            
            neightborHeight = heightmap[(y - 1) * worldWidth + (x - 1)];
            if (y - 1 >= 0 && x - 1 >= 0)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            neightborHeight = heightmap[(y + 1) * worldWidth + (x - 1)];
            if (y + 1 < worldHeight && x - 1 >= 0)
            {
                if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            neightborHeight = heightmap[(y - 1) * worldWidth + (x + 1)];
            if (y - 1 >= 0 && x + 1 < worldWidth)
            {
               if (height - neighborHeight <= -2)
                {
                    height = neighborHeight - 1;
                }
            }
            
            
            heightmap[index] = height;
        }
    }

    
    /*
    if(rec < 20) {
        rec++; 
        this.correctHeights(chunkCount, chunkSize, heightmap, rec); 
    }
    */  


    // DEBUG ASSERT
    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
            var index = y * worldWidth + x;
            for (var offsetY = -1; offsetY <= 1; offsetY++)
            {
                for (var offsetX = -1; offsetX <= 1; offsetX++)
                {
                    if (offsetX == 0 && offsetY == 0)
                        continue;
                    var neighborX = x + offsetX;
                    var neighborY = y + offsetY;
                    var neighborIndex = neighborY * worldWidth + neighborX;
                    if (neighborX < 0 || neighborX >= worldWidth)
                        continue;
                    if (neighborY < 0 || neighborY >= worldHeight)
                        continue;

                    var neighborHeight = heightmap[neighborIndex];
                    var height = heightmap[index];
                    if (Math.abs(height - neighborHeight) > 1)
                        console.log("Error: Two neighboring tiles have more than 2 in height difference");
                }
            }
        }
    }
    // /DEBUG

    return heightmap;
}

WorldGenerator.prototype.generateSlopemap = function(chunkCount, chunkSize, heightmap)
{
    var worldWidth = chunkCount.x * chunkSize;
    var worldHeight = chunkCount.y * chunkSize;
    var slopemap = new Array(worldWidth * worldHeight);

    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
            var index = y * worldWidth + x;
            for (var offsetY = -1; offsetY <= 1; offsetY++)
            {
                for (var offsetX = -1; offsetX <= 1; offsetX++)
                {
                    if (offsetX == 0 && offsetY == 0)
                        continue;

                    var neighborX = x + offsetX;
                    var neighborY = y + offsetY;
                    var neighborIndex = neighborY * worldWidth + neighborX;
                    if (neighborX < 0 || neighborX >= worldWidth)
                        continue;
                    if (neighborY < 0 || neighborY >= worldHeight)
                        continue;

                    var neighborHeight = heightmap[neighborIndex];
                    var height = heightmap[index];
                    var slope = slopemap[index];

                    if (neighborHeight > height)
                    {
                        if (offsetX == -1 && offsetY == -1)
                        {
                            slope |= 0x1;
                        }

                        if (offsetX == 0 && offsetY == -1)
                        {
                            slope |= 0x1;
                            slope |= 0x2;
                        }

                        if (offsetX == 1 && offsetY == -1)
                        {
                            slope |= 0x2;
                        }

                        if (offsetX == 1 && offsetY == 0)
                        {
                            slope |= 0x2;
                            slope |= 0x4;
                        }

                        if (offsetX == 1 && offsetY == 1)
                        {
                            slope |= 0x4;
                        }

                        if (offsetX == 0 && offsetY == 1)
                        {
                            slope |= 0x4;
                            slope |= 0x8;
                        }

                        if (offsetX == -1 && offsetY == 1)
                        {
                            slope |= 0x8;
                        }

                        if (offsetX == -1 && offsetY == 0)
                        {
                            slope |= 0x1;
                            slope |= 0x8;
                        }
                    }

                    slopemap[index] = slope;
                }
            }
        }
    }

    return slopemap;
};

WorldGenerator.prototype.generateChunk = function(x, y, chunkSize, chunkCount, heightmap, slopemap)
{
    var chunkEntity = this.entityManager.createEntity(['Transform', 'Renderable', 'Chunk', 'Pickable']);
    var chunk = this.entityManager.getComponent(chunkEntity, 'Chunk');
    var transform = this.entityManager.getComponent(chunkEntity, 'Transform');
    var renderable = this.entityManager.getComponent(chunkEntity, 'Renderable');
    var pickable = this.entityManager.getComponent(chunkEntity, 'Pickable');

    pickable.x = 4;

    chunk.heights = new Array(chunkSize * chunkSize);
    chunk.slopes = new Array(chunkSize * chunkSize);

    this.assignHeights(chunk, x, y, chunkSize, chunkCount, heightmap);
    this.assignSlopes(chunk, x, y, chunkSize, chunkCount, slopemap);

    this.generateVertices(chunkSize, chunk, renderable);

    transform.position = new THREE.Vector3(x * chunkSize, 0, y * chunkSize);

    var edges = this.entityManager.createEntity(['Transform', 'Renderable']);
    var edgesRenderable = this.entityManager.getComponent(edges, 'Renderable');
    edgesRenderable.mesh = new THREE.WireframeHelper( renderable.mesh, 0x00ff00 );

    return chunk;
}

WorldGenerator.prototype.assignHeights = function(chunkComponent, chunkX, chunkY, chunkSize, chunkCount, heightmap)
{
    for(var y = 0; y < chunkSize; y++)
    {
        for(var x = 0; x < chunkSize; x++)
        {
            var index = y * chunkSize + x;
            var globalX = chunkX * chunkSize + x;
            var globalY = chunkY * chunkSize + y;
            var globalIndex = globalY * chunkCount.x * chunkSize + globalX;

            chunkComponent.heights[index] = heightmap[globalIndex];
        }
    }
};

WorldGenerator.prototype.assignSlopes = function(chunkComponent, chunkX, chunkY, chunkSize, chunkCount, slopemap)
{
    for(var y = 0; y < chunkSize; y++)
    {
        for(var x = 0; x < chunkSize; x++)
        {
            var index = y * chunkSize + x;
            var globalX = chunkX * chunkSize + x;
            var globalY = chunkY * chunkSize + y;
            var globalIndex = globalY * chunkCount.x * chunkSize + globalX;

            chunkComponent.slopes[index] = slopemap[globalIndex];
        }
    }
};

WorldGenerator.prototype.generateSlopes = function(chunkComponent, chunkSize)
{
    for (var y = 0; y < chunkSize; y++)
    {
       for (var x = 0; x < chunkSize; x++)
       {
           this.generateSlope(chunkComponent, chunkSize, x, y);
       }
   }
}

WorldGenerator.prototype.generateSlope = function(chunkComponent, chunkSize, x, y)
{
    var index = y * chunkSize + x;
    for (var offsetY = -1; offsetY <= 1; offsetY++)
    {
        for (var offsetX = -1; offsetX <= 1; offsetX++)
        {
            if (offsetX == 0 && offsetY == 0)
                continue;

            var neighborIndex = (y + offsetY) * chunkSize + (x + offsetX);
            if (neighborIndex < 0 || neighborIndex >= chunkSize * chunkSize)
                continue;

            var neighborHeight = chunkComponent.heights[neighborIndex];
            var height = chunkComponent.heights[index];
            var slope = chunkComponent.slopes[index];
            if (neighborHeight > height)
            {
                if (offsetX == -1 && offsetY == -1)
                {
                    slope |= 0x1;
                }

                if (offsetX == 0 && offsetY == -1)
                {
                    slope |= 0x1;
                    slope |= 0x2;
                }

                if (offsetX == 1 && offsetY == -1)
                {
                    slope |= 0x2;
                }

                if (offsetX == 1 && offsetY == 0)
                {
                    slope |= 0x2;
                    slope |= 0x4;
                }

                if (offsetX == 1 && offsetY == 1)
                {
                    slope |= 0x4;
                }

                if (offsetX == 0 && offsetY == 1)
                {
                    slope |= 0x4;
                    slope |= 0x8;
                }

                if (offsetX == -1 && offsetY == 1)
                {
                    slope |= 0x8;
                }

                if (offsetX == -1 && offsetY == 0)
                {
                    slope |= 0x1;
                    slope |= 0x8;
                }
            }

            chunkComponent.slopes[index] = slope;
        }
    }

}

WorldGenerator.prototype.generateVertices = function(chunkSize, chunkComponent, renderableComponent)
{
    var vertices = new Float32Array(chunkSize * chunkSize * 6 * 3);
    for (var y = 0; y < chunkSize; y++)
    {
        for (var x = 0; x < chunkSize; x++)
        {
            var tileIndex = x + y * chunkSize;
            var height = chunkComponent.heights[tileIndex];
            var slope = chunkComponent.slopes[tileIndex];

            var index = tileIndex * 6 * 3;
            vertices[index] = x;
            vertices[index+1] = height + (slope & 0x1);
            vertices[index+2] = y;

            vertices[index+3] = x+1;
            vertices[index+4] = height + ((slope & 0x2) >> 1);
            vertices[index+5] = y;

            vertices[index+6] = x+1;
            vertices[index+7] = height + ((slope & 0x4) >> 2);
            vertices[index+8] = y+1;


            vertices[index+9] = x+1;
            vertices[index+10] = height + ((slope & 0x4) >> 2);
            vertices[index+11] = y+1;

            vertices[index+12] = x;
            vertices[index+13] = height + ((slope & 0x8) >> 3);
            vertices[index+14] = y+1;

            vertices[index+15] = x;
            vertices[index+16] = height + (slope & 0x1);
            vertices[index+17] = y;
        }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide });

    renderableComponent.mesh = new THREE.Mesh(geometry, material);
}
