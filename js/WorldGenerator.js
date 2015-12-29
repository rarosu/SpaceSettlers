function WorldGenerator(entityManager)
{
    this.entityManager = entityManager;
}

WorldGenerator.prototype.generateWorld = function(chunkCount, chunkSize)
{
    var heightmap = this.generateHeightmap(chunkCount, chunkSize);

    var chunks = [];
    for (var y = 0; y < chunkCount.y; y++)
    {
        for (var x = 0; x < chunkCount.x; x++)
        {
            var index = y * chunkCount.x + x;
            chunks[index] = this.generateChunk(x, y, chunkSize, chunkCount, heightmap);
        }
    }

    var world = this.entityManager.createEntity(['World']);
    var worldComponent = this.entityManager.getComponent(world, 'World');
    worldComponent.chunks = chunks;

    return world;
}

WorldGenerator.prototype.generateHeightmap = function(chunkCount, chunkSize)
{
    var worldWidth = chunkCount.x * chunkSize;
    var worldHeight = chunkCount.y * chunkSize;
    var heightmap = new Array(worldWidth * worldHeight);

    var permutations = Simplex.randomPermutations();
    var frequencyScale = 0.01;
    var amplitudeScale = 4.0;
    for (var y = 0; y < worldHeight; y++)
    {
        for (var x = 0; x < worldWidth; x++)
        {
            var height = Math.floor(amplitudeScale * Simplex.simplex2d(x * frequencyScale, y * frequencyScale, permutations));
            
            //var height = 0; 
            var index = y * worldWidth + x;
            
            /*
            var middle = 220;
            
             if(index == middle) 
                height = 2;
            
             if(index == middle - 1) 
                height = 1;
             if(index == middle + 1) 
                height = 1;
             if (index == middle + worldWidth)
                height = 1;
             if (index == middle + worldWidth + 1)
                height = 1;
             if (index == middle + worldWidth - 1)
                height = 1;
             if (index == middle - worldWidth)
                height = 1;
             if (index == middle - worldWidth + 1)
                height = 1;
             if (index == middle - worldWidth - 1)
                height = 1;
            */ 
    

            
            var neighborHeight = heightmap[y * worldWidth + (x - 1)];
            if (x - 1 >= 0)
            {
                if (height - neighborHeight == -2)
                {
                    height++;
                }
            }

            neightborHeight = heightmap[(y - 1) * worldWidth + (x - 1)];
            if (y - 1 >= 0 && x - 1 >= 0)
            {
                if (height - neighborHeight == -2)
                {
                    height++;
                }
            }
            
            neightborHeight = heightmap[(y - 1) * worldWidth + x];
            if (y - 1 >= 0 && x >= 0)
            {
                if (height - neighborHeight == -2)
                {
                    height++;
                }
            }
            
            neightborHeight = heightmap[(y - 1) * worldWidth + (x + 1)];
            if (y - 1 >= 0 && x + 1 >= 0)
            {
               if (height - neighborHeight == -2)
                {
                    height++;
                }
            }
             

            heightmap[index] = height;
        }
    }

    return heightmap;
}

WorldGenerator.prototype.generateChunk = function(x, y, chunkSize, chunkCount, heightmap)
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
    this.generateSlopes(chunk, chunkSize);
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
           //var globalIndex = (chunkY * chunkCount.x + chunkX) * (chunkSize * chunkSize) + index;
           var globalX = chunkX * chunkSize + x;
           var globalY = chunkY * chunkSize + y;
           var globalIndex = globalY * chunkCount.x * chunkSize + globalX;
           //var chunkIndex = y * chunkSize + x;

           chunkComponent.heights[index] = heightmap[globalIndex];
       }
    }
};

WorldGenerator.prototype.generateHeights = function(chunkX, chunkY, chunkComponent, chunkSize)
{
    /*
    for(var y = 0; y < chunkSize; y++)
    {
       for(var x = 0; x < chunkSize; x++)
       {
           var globalX = chunkX * chunkSize + x;
           var globalY = chunkY * chunkSize + y;
           var height = amplitudeScale * Simplex.simplex2d(globalX * frequencyScale, globalY * frequencyScale, this.permutations);
           var index = y * chunkSize + x;

           
           
           chunkComponent.heights[index] = height;
       }
   }
    */ 
   
   var middle = 120;
    for(var y = 0; y < chunkSize; y++)
    {
       for(var x = 0; x < chunkSize; x++)
       {
            var index = y * chunkSize + x;
            chunkComponent.heights[index] = 0;
             if(index == middle) 
                chunkComponent.heights[index] = 2;
             if(index == middle - 1) 
                chunkComponent.heights[index] = 1;
             if(index == middle + 1) 
                chunkComponent.heights[index] = 1;
             if (index == middle + chunkSize)
                chunkComponent.heights[index] = 1;
             if (index == middle + chunkSize + 1)
                chunkComponent.heights[index] = 1;
             if (index == middle + chunkSize - 1)
                chunkComponent.heights[index] = 1;
             if (index == middle - chunkSize)
                chunkComponent.heights[index] = 1;
             if (index == middle - chunkSize + 1)
                chunkComponent.heights[index] = 1;
             if (index == middle - chunkSize - 1)
                chunkComponent.heights[index] = 1;
       }
    }
   
}

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
