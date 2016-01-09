
function WorldGenerator(entityManager)
{
	this.entityManager = entityManager;
	this.MIN_HEIGHT = -255;
	this.MAX_HEIGHT = 255;
	
	this.SLOPE_FLAT = 0x0;
	this.SLOPE_NW = 0x1;
	this.SLOPE_NE = 0x2;
	this.SLOPE_SW = 0x4;
	this.SLOPE_SE = 0x8;
}

/**
	Create a world entity and a set of chunk entities with procedurally generated terrain.
	
	@param {Object} chunkCount - An object {x, y} specifying how many chunks to generate.
	@param {Number} chunkSize - The side length in tiles of a square chunk.
	@return {Number} - A new world entity.
*/
WorldGenerator.prototype.generateWorld = function(chunkCount, chunkSize)
{
	var heightmap = this.generateHeightmap(chunkCount, chunkSize);
	var chunks = this.generateChunks(heightmap, chunkCount, chunkSize);
};

WorldGenerator.prototype.generateHeight = function(x, y, permutations)
{
    var height = 0;
    var octaveCount = 3;
    var frequencyScale = 0.01;
    var amplitudeScale = 5.0;
    for (var i = 0; i < octaveCount; i++)
    {
        height += amplitudeScale * Simplex.simplex2d(x * frequencyScale, y * frequencyScale, permutations);
        frequencyScale *= 2;
        amplitudeScale /= 2;
    }

    height = Math.floor(height);
    height = Math.max(this.MIN_HEIGHT, Math.min(this.MAX_HEIGHT, height));

    return height;
};

/**
	Generate a height value for all tile corners and ensure that no neighboring corners differ more than 1 in height.
	
	@param {Object} chunkCount - An object {x, y} specifying how many chunks to generate.
	@param {Number} chunkSize - The side length in tiles of a square chunk.
	@return {Array} An array of heights for all tile corners.
*/
WorldGenerator.prototype.generateHeightmap = function(chunkCount, chunkSize)
{
	// The number of tile corners in the world in both directions.
	var worldWidth = chunkCount.x * chunkSize + 1;
	var worldHeight = chunkCount.y * chunkSize + 1;
	
	// Create initial storage.
	var heightmap = new Array(worldWidth * worldHeight);
	
	// Procedurally generate heights using simplex noise.
	var permutations = Simplex.randomPermutations();
    //var frequencyScale = 0.02;
    //var amplitudeScale = 12.0;
	for (var y = 0; y < worldHeight; y++)
	{
		for (var x = 0; x < worldWidth; x++)
		{
		    var height = this.generateHeight(x, y, permutations);
			//var height = Math.floor(amplitudeScale * Simplex.simplex2d(x * frequencyScale, y * frequencyScale, permutations));
			//height = Math.max(this.MIN_HEIGHT, Math.min(this.MAX_HEIGHT, height));
			
			var index = y * worldWidth + x;
			heightmap[index] = height;
		}
	}
	
	// Fix the heightmap to ensure that no two neighboring corners differ with more than 1 height.
	//this.correctHeights(heightmap, worldWidth, worldHeight);
	
	return heightmap;
};

/**
	Ensure that no two neighboring tile corners (in horizontal and vertical direction, but not necessarily diagonally) 
	in the heightmap have more than 1 height difference. This is a requirement for the terrain. Returns nothing, 
	manipulates the heightmap in place.
	
	@param {Array} An array of heights for all tile corners.
	@param {worldWidth} The number of tile corners in x-direction.
	@param {worldHeight} The number of tile corners in y-direction.
*/
WorldGenerator.prototype.correctHeights = function(heightmap, worldWidth, worldHeight)
{
	// For every corner, check the horizontal and vertical neighbors and lower the corner if it is too high.
	// Check top and left corners relative to the current corner first. This ensures only traversed (with final height) corners are compared against.
	for (var y = 0; y < worldHeight; y++)
	{
		for (var x = 0; x < worldWidth; x++)
		{
			var lowest = this.MAX_HEIGHT;
			
			// Check previously traversed corners only.
			if (x != 0)
			{
				var neighborIndex = y * worldWidth + (x - 1);
				if (heightmap[neighborIndex] < lowest)
				{
					lowest = heightmap[neighborIndex];
				}
			}
			
			if (y != 0)
			{
				var neighborIndex = (y - 1) * worldWidth + x;
				if (heightmap[neighborIndex] < lowest)
				{
					lowest = heightmap[neighborIndex];
				}
			}
			
			// Is the height difference larger than 1? If so, lower this corner.
			var index = y * worldWidth + x;
			if (heightmap[index] >= lowest + 2)
			{
				heightmap[index] = lowest + 1;
			}
		}
	}
	
	// Check bottom and right corners.
	for (var y = worldHeight - 1; y >= 0; y--)
	{
		for (var x = worldWidth - 1; x >= 0; x--)
		{
			var lowest = this.MAX_HEIGHT;
			if (x != worldWidth - 1)
			{
				var neighborIndex = y * worldWidth + (x + 1);
				if (heightmap[neighborIndex] < lowest)
				{
					lowest = heightmap[neighborIndex];
				}
			}
			
			if (y != worldHeight - 1)
			{
				var neighborIndex = (y + 1) * worldWidth + x;
				if (heightmap[neighborIndex] < lowest)
				{
					lowest = heightmap[neighborIndex];
				}
			}
			
			// Is the height difference larger than 1? If so, lower this corner.
			var index = y * worldWidth + x;
			if (heightmap[index] >= lowest + 2)
			{
				heightmap[index] = lowest + 1;
			}
		}
	}
};

/**
	Generate an array of chunk entities.
	
	@param {Array} heightmap - An array of heights for all tile corners.
	@param {Object} chunkCount - An object {x, y} specifying how many chunks to generate.
	@param {Number} chunkSize - The side length in tiles of a square chunk.
	@return {Array} - An array of chunk entities.
*/
WorldGenerator.prototype.generateChunks = function(heightmap, chunkCount, chunkSize)
{
	var chunks = new Array(chunkCount.x * chunkCount.y);
	for (var y = 0; y < chunkCount.y; y++)
	{
		for (var x = 0; x < chunkCount.x; x++)
		{
			var index = y * chunkCount.x + x;
			chunks[index] = this.generateChunk(heightmap, chunkCount, chunkSize, x, y);
		}
	}
	
	return chunks;
};

/**
	Generate a single chunk entity.
	
	@param {Array} heightmap - An array of heights for all tile corners.
	@param {Number} chunkSize - The side length in tiles of a square chunk.
	@param {Object} chunkCount - An object {x, y} specifying how many chunks to generate.
	@param {Number} chunkX - The index of this chunk in x-direction.
	@param {Number} chunkY - The index of this chunk in y-direction.
	@return {Number} - The chunk entity.
*/
WorldGenerator.prototype.generateChunk = function(heightmap, chunkCount, chunkSize, chunkX, chunkY)
{
    var chunkEntity = this.entityManager.createEntity(['Transform', 'Renderable', 'Chunk', 'Pickable']);
    var chunk = this.entityManager.getComponent(chunkEntity, 'Chunk');
    var transform = this.entityManager.getComponent(chunkEntity, 'Transform');
    var renderable = this.entityManager.getComponent(chunkEntity, 'Renderable');
    var pickable = this.entityManager.getComponent(chunkEntity, 'Pickable');

    transform.position = new THREE.Vector3(chunkX * chunkSize, 0, chunkY * chunkSize);
    chunk.size = chunkSize; 
	this.generateVertices(heightmap, chunkCount, chunkSize, chunkX, chunkY, renderable);
	
	// DEBUG: Outline the chunk geometry with a green grid.
    //var edges = this.entityManager.createEntity(['Transform', 'Renderable']);
    //var edgesRenderable = this.entityManager.getComponent(edges, 'Renderable');
    //edgesRenderable.mesh = new THREE.WireframeHelper( renderable.mesh, 0x00ff00 );
	// /DEBUG
	
    return chunk;
};

/**
	Generate a vertex buffer for a chunk.
	
	@param {Array} heightmap - An array of heights for all tile corners.
	@param {Object} chunkCount - 
	@param {Object} renderable - The renderable component of the chunk.
*/
WorldGenerator.prototype.generateVertices = function(heightmap, chunkCount, chunkSize, chunkX, chunkY, renderable)
{	
    var positions = this.generatePositions(heightmap, chunkCount, chunkSize, chunkX, chunkY);
    var normals = this.generateNormals(heightmap, chunkCount, chunkSize, chunkX, chunkY);

	var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    var material = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide });
    //var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide });

    renderable.mesh = new THREE.Mesh(geometry, material);
};

/**
    Generate the vertex positions of the heightmap.
*/
WorldGenerator.prototype.generatePositions = function(heightmap, chunkCount, chunkSize, chunkX, chunkY)
{
    var positions = new Float32Array(chunkSize * chunkSize * 6 * 3);

	var worldWidth = chunkCount.x * chunkSize + 1;
    for (var y = 0; y < chunkSize; y++)
    {
        for (var x = 0; x < chunkSize; x++)
        {
			var globalX = chunkX * chunkSize + x;
			var globalY = chunkY * chunkSize + y;
			var slope = this.getSlope(heightmap, worldWidth, globalX, globalY);
			
            // Use this layout by default.
		    // +----+
		    // |  / |
		    // | /  |
		    // +----+

            // If either NE or SW is raised, use this layout!
		    // +----*
		    // | \  |
		    // |  \ |
		    // *----+

		    var nw = heightmap[globalY * worldWidth + globalX];
		    var ne = heightmap[globalY * worldWidth + globalX + 1];
		    var sw = heightmap[(globalY + 1) * worldWidth + globalX];
		    var se = heightmap[(globalY + 1) * worldWidth + globalX + 1];

            var tileIndex = y * chunkSize + x;
            var index = tileIndex * 6 * 3;
			if (slope == this.SLOPE_NE || slope == this.SLOPE_SW)
			{
                positions[index] = x;
                positions[index+1] = nw;
                positions[index+2] = y;

                positions[index+3] = x;
                positions[index+4] = sw;
                positions[index+5] = y+1;

                positions[index+6] = x+1;
                positions[index+7] = se;
                positions[index+8] = y+1;


                positions[index+9] = x+1;
                positions[index+10] = se;
                positions[index+11] = y+1;

                positions[index+12] = x+1;
                positions[index+13] = ne;
                positions[index+14] = y;

                positions[index+15] = x;
                positions[index+16] = nw;
                positions[index+17] = y;
			}
			else
			{
                positions[index] = x;
                positions[index+1] = nw;
                positions[index+2] = y;

                positions[index+3] = x;
                positions[index+4] = sw;
                positions[index+5] = y+1;

                positions[index+6] = x+1;
                positions[index+7] = ne;
                positions[index+8] = y;


                positions[index+9] = x;
                positions[index+10] = sw;
                positions[index+11] = y+1;

                positions[index+12] = x+1;
                positions[index+13] = se;
                positions[index+14] = y+1;

                positions[index+15] = x+1;
                positions[index+16] = ne;
                positions[index+17] = y;
			}
		}
	}

    return positions;
};

/**
    Generate the vertex normals of the heightmap.
*/
WorldGenerator.prototype.generateNormals = function(heightmap, chunkCount, chunkSize, chunkX, chunkY)
{
	var normals = new Float32Array(chunkSize * chunkSize * 6 * 3);

	var worldWidth = chunkCount.x * chunkSize + 1;
    for (var y = 0; y < chunkSize; y++)
    {
        for (var x = 0; x < chunkSize; x++)
        {
            var globalX = chunkX * chunkSize + x;
			var globalY = chunkY * chunkSize + y;
			var slope = this.getSlope(heightmap, worldWidth, globalX, globalY);

			// Use this layout by default.
		    // +----+
		    // |  / |
		    // | /  |
		    // +----+

            // If either NE or SW is raised, use this layout!
		    // +----*
		    // | \  |
		    // |  \ |
		    // *----+

		    var nw = heightmap[globalY * worldWidth + globalX];
		    var ne = heightmap[globalY * worldWidth + globalX + 1];
		    var sw = heightmap[(globalY + 1) * worldWidth + globalX];
		    var se = heightmap[(globalY + 1) * worldWidth + globalX + 1];

            var tileIndex = y * chunkSize + x;
            var index = tileIndex * 6 * 3;
			if (slope == this.SLOPE_NE || slope == this.SLOPE_SW)
			{
                var p1 = new THREE.Vector3(x, nw, y);
                var p2 = new THREE.Vector3(x, sw, y+1);
                var p3 = new THREE.Vector3(x+1, se, y+1);
                var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                normals[index] = n.x;
                normals[index + 1] = n.y;
                normals[index + 2] = n.z;
                
                normals[index + 3] = n.x;
                normals[index + 4] = n.y;
                normals[index + 5] = n.z;
                
                normals[index + 6] = n.x;
                normals[index + 7] = n.y;
                normals[index + 8] = n.z;


                p1 = new THREE.Vector3(x+1, se, y+1);
                p2 = new THREE.Vector3(x+1, ne, y);
                p3 = new THREE.Vector3(x, nw, y);
                n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                normals[index + 9] = n.x;
                normals[index + 10] = n.y;
                normals[index + 11] = n.z;
                
                normals[index + 12] = n.x;
                normals[index + 13] = n.y;
                normals[index + 14] = n.z;
                
                normals[index + 15] = n.x;
                normals[index + 16] = n.y;
                normals[index + 17] = n.z;
			}
			else
			{
                var p1 = new THREE.Vector3(x, nw, y);
                var p2 = new THREE.Vector3(x, sw, y+1);
                var p3 = new THREE.Vector3(x+1, ne, y);
                var n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                normals[index] = n.x;
                normals[index + 1] = n.y;
                normals[index + 2] = n.z;
                
                normals[index + 3] = n.x;
                normals[index + 4] = n.y;
                normals[index + 5] = n.z;
                
                normals[index + 6] = n.x;
                normals[index + 7] = n.y;
                normals[index + 8] = n.z;


                p1 = new THREE.Vector3(x, sw, y+1);
                p2 = new THREE.Vector3(x+1, se, y+1);
                p3 = new THREE.Vector3(x+1, ne, y);
                n = p3.sub(p1).cross(p2.sub(p1)).normalize();

                normals[index + 9] = n.x;
                normals[index + 10] = n.y;
                normals[index + 11] = n.z;
                
                normals[index + 12] = n.x;
                normals[index + 13] = n.y;
                normals[index + 14] = n.z;
                
                normals[index + 15] = n.x;
                normals[index + 16] = n.y;
                normals[index + 17] = n.z;
			}
        }
    }

	return normals;
};

/**
	Get the slope of a tile. The returned value can be masked using the SLOPE_* constants to determine the type of slope.
	
	@param {Array} heightmap - An array of heights for all tile corners.
	@param {Number} worldWidth - The number of tile corners in horizontal direction (one more than the number of tiles).
	@param {Number} x - The horizontal index of the tile (tile index, not tile corner index).
	@param {Number} y - The vertical index of the tile (tile index, not tile corner index).
	@return {Number} - A slope value that can be masked using the SLOPE_* constants.
*/
WorldGenerator.prototype.getSlope = function(heightmap, worldWidth, x, y)

{
	var nw = heightmap[y * worldWidth + x];
	var ne = heightmap[y * worldWidth + (x + 1)];
	var sw = heightmap[(y + 1) * worldWidth + x];
	var se = heightmap[(y + 1) * worldWidth + (x + 1)];
	var min = Math.min(Math.min(nw, ne), Math.min(sw, se));
	
	var slope = this.SLOPE_FLAT;
	if (nw !== min) slope |= this.SLOPE_NW;
	if (ne !== min) slope |= this.SLOPE_NE;
	if (sw !== min) slope |= this.SLOPE_SW;
	if (se !== min) slope |= this.SLOPE_SE;
	
	return slope;
};
