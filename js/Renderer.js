function RenderingProcessor(entityManager)
{
    this.entityManager = entityManager;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Hard-coded light for the time being.
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);

    var cameraEntity = this.entityManager.getEntityByTag('Camera');
    if (cameraEntity !== undefined)
    {
        var camera = this.entityManager.getComponent(cameraEntity, 'Camera');
        controls = new THREE.OrbitControls( camera.camera, this.renderer.domElement );
                        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
    }


    // Setup window-resizing.
    var _this = this;
    var resizeCallback = function()
    {
        _this.renderer.setSize(window.innerWidth, window.innerHeight);

        var cameraEntity = _this.entityManager.getEntityByTag('Camera');
        if (cameraEntity !== undefined)
        {
            var camera = _this.entityManager.getComponent(cameraEntity, 'Camera');
            camera.camera.aspect = window.innerWidth / window.innerHeight;
            camera.camera.updateProjectionMatrix();
        }
    }

    window.addEventListener('resize', resizeCallback, false);
}

RenderingProcessor.prototype.update = function()
{
    var entities = this.entityManager.getEntitiesByProcessor(this);
    for (var i = 0; i < entities.length; i++)
    {
        var transform = this.entityManager.getComponent(entities[i], 'Transform');
        var renderable = this.entityManager.getComponent(entities[i], 'Renderable');

        if (renderable.mesh)
        {
            renderable.mesh.position.copy(transform.position);
            renderable.mesh.quaternion = transform.orientation;

            if (!renderable.addedToScene)
            {
                this.scene.add(renderable.mesh);
                renderable.addedToScene = true;
            }
        }
    }

    var cameraEntity = this.entityManager.getEntityByTag('Camera');
    var camera = this.entityManager.getComponent(cameraEntity, 'Camera');

    this.renderer.render(this.scene, camera.camera);
}

RenderingProcessor.prototype.getTextSprite = function(text, scale)
{
    if (scale === undefined)
        scale = 1;

    var size = 18;
    var margin = 10;
    var font = "Bold " + size + "pt Arial";

    // Create a context for determining the size of the real context.
    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');
    context.font = font;
    var textWidth = context.measureText(text).width;

    canvas.width = textWidth + margin;
    canvas.height = size + margin;

    // Create a new, actual context for rendering.
    var context = canvas.getContext('2d');
    context.font = font;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.textAlign = "start";
    context.textBaseline = "middle";
    context.fillText(text, 0, canvas.height / 2);
    //context.fillRect(0, 0, canvas.width, canvas.height);

    // Generate a texture and a sprite from the canvas.
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.NearestFilter;

    var spriteMaterial = new THREE.SpriteMaterial(
        { map: texture }
    );

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale * canvas.width / canvas.height, scale, 1);

    return sprite;
}
