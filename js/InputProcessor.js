function InputProcessor(entityManager)
{
    this.entityManager = entityManager;
    $(document).keydown([this,entityManager], this.keydown);
    $(document).keyup([this,entityManager], this.keyup);
    $(document).mousemove([this,entityManager], this.mousemove);
    $(document).mousedown([this,entityManager], this.mousedown);
    $(document).mouseup([this,entityManager], this.mouseup);
}

InputProcessor.prototype.update = function()
{

}

InputProcessor.prototype.keydown = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entities = entityManager.getEntitiesByProcessor(inputProcessor);
    for (var i = 0; i < entities.length; i++)
    {
        var inputReceiver = entityManager.getComponent(entities[i], 'InputReceiver');
        var index = inputReceiver.keyCodes.indexOf(e.keyCode);
        if(index < 0) {
            inputReceiver.keyCodes.push(e.keyCode);
        }
    }
}

InputProcessor.prototype.keyup = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entities = entityManager.getEntitiesByProcessor(inputProcessor);
    for (var i = 0; i < entities.length; i++)
    {
        var inputReceiver = entityManager.getComponent(entities[i], 'InputReceiver');
        var index = inputReceiver.keyCodes.indexOf(e.keyCode);
        if(index >= 0) {
            inputReceiver.keyCodes.splice(index, 1);
        }
    }
}

InputProcessor.prototype.mousemove = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entities = entityManager.getEntitiesByProcessor(inputProcessor);
    for (var i = 0; i < entities.length; i++)
    {
        var inputReceiver = entityManager.getComponent(entities[i], 'InputReceiver');
        inputReceiver.mousePositionDelta.x = e.clientX - inputReceiver.mousePosition.x;
        inputReceiver.mousePositionDelta.y = e.clientY - inputReceiver.mousePosition.y;
        inputReceiver.mousePosition.x = e.clientX;
        inputReceiver.mousePosition.y = e.clientY;
        if(inputReceiver.mouseMove)
            inputReceiver.mouseMove(entities[i], entityManager);

    }
}

InputProcessor.prototype.mousedown = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entities = entityManager.getEntitiesByProcessor(inputProcessor);
    for (var i = 0; i < entities.length; i++)
    {
        var inputReceiver = entityManager.getComponent(entities[i], 'InputReceiver');
        inputReceiver.mouseDownPosition.x = e.clientX;
        inputReceiver.mouseDownPosition.y = e.clientY;
        inputReceiver.mouseLeftDown = true;
        if(inputReceiver.mouseDown)
            inputReceiver.mouseDown(entities[i], entityManager);
    }
}

InputProcessor.prototype.mouseup = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entities = entityManager.getEntitiesByProcessor(inputProcessor);
    for (var i = 0; i < entities.length; i++)
    {
        var inputReceiver = entityManager.getComponent(entities[i], 'InputReceiver');
        inputReceiver.mouseLeftDown = false;
    }
}
