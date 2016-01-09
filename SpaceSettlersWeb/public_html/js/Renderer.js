function RenderingProcessor(entityManager)
{
    this.entityManager = entityManager;
	this.entityFilter = this.entityManager.createEntityFilter(['Transform', 'Renderable']);
    this.pickingMessageFilter = this.entityManager.createEntityFilter(['PickingMessage']);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Hard-coded light for the time being.
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);

    this.directionalLights = [];

    this.directionalLights.push(new THREE.DirectionalLight(0xffffff, 0.25));
    this.directionalLights[0].position.set(-1, -1, 0).normalize();

    this.directionalLights.push(new THREE.DirectionalLight(0xffffff, 0.25));
    this.directionalLights[1].position.set(1, -1, 0).normalize();

    for (var i = 0; i < this.directionalLights.length; i++)
    {
        this.scene.add(this.directionalLights[i]);
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
    for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next())
    {
        var transform = this.entityManager.getComponent(entity, 'Transform');
        var renderable = this.entityManager.getComponent(entity, 'Renderable');

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

    /*
    for (var message = this.pickingMessageFilter.first(); message !== undefined; message = this.pickingMessageFilter.next()) {
        var pickingMessage = this.entityManager.getComponent(message, 'PickingMessage');
        var renderable = this.entityManager.getComponent(pickingMessage.entity, 'Renderable');
        renderable.mesh.material.color = 0x0000ff;
    }
    */

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
