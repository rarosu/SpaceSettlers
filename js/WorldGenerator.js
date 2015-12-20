function WorldGenerator(entityManager)
{
    this.entityManager = entityManager;
}

WorldGenerator.prototype.generateWorld = function(chunkCount, chunkSize)
{
    var chunks = [];
    for (var y = 0; y < chunkCount.y; y++)
    {
        for (var x = 0; x < chunkCount.x; x++)
        {
            var index = y * chunkCount.x + x;
            chunks[index] = this.generateChunk(x, y, chunkSize);
        }
    }

    var world = this.entityManager.createEntity(['World']);
    var worldComponent = this.entityManager.getComponent(world, 'World');
    worldComponent.chunks = chunks;

    return world;
}

WorldGenerator.prototype.generateChunk = function(x, y, chunkSize)
{
    var chunkEntity = this.entityManager.createEntity(['Transform', 'Renderable', 'Chunk']);
    var chunk = this.entityManager.getComponent(chunkEntity, 'Chunk');
    var transform = this.entityManager.getComponent(chunkEntity, 'Transform');
    var renderable = this.entityManager.getComponent(chunkEntity, 'Renderable');

    chunk.heights = new Array(chunkSize * chunkSize);
    chunk.slopes = new Array(chunkSize * chunkSize);

    this.generateHeights(chunk, chunkSize);
    this.generateSlopes(chunk, chunkSize);
    this.generateVertices(chunkSize, chunk, renderable);

    transform.position = new THREE.Vector3(x * chunkSize, 0, y * chunkSize);

    var edges = this.entityManager.createEntity(['Transform', 'Renderable']);
    var edgesRenderable = this.entityManager.getComponent(edges, 'Renderable');
    edgesRenderable.mesh = new THREE.WireframeHelper( renderable.mesh, 0x00ff00 );

    return chunk;
}

WorldGenerator.prototype.generateHeights = function(chunkComponent, chunkSize)
{
    for(var y = 0; y < chunkSize; y++)
    {
       for(var x = 0; x < chunkSize; x++)
       {
           var index = y * chunkSize + x;
           if (Math.random() < 0.1)
           {
               chunkComponent.heights[index] = 1;
           }
           else
           {
               chunkComponent.heights[index] = 0;
           }
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
    if (x == 2 && y == 1)
        var t = 0;

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

            if (offsetX == -1 && offsetY == 0)
                var t = 0;

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
