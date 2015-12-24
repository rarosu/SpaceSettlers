function InputProcessor(entityManager)
{
    this.entityManager = entityManager;
	this.entityFilter = this.entityManager.createEntityFilter(['InputReceiver']);
    $(document).keydown([this, entityManager, this.entityFilter], this.keydown);
    $(document).keyup([this, entityManager, this.entityFilter], this.keyup);
    $(document).mousemove([this, entityManager, this.entityFilter], this.mousemove);
    $(document).mousedown([this, entityManager, this.entityFilter], this.mousedown);
    $(document).mouseup([this, entityManager, this.entityFilter], this.mouseup);
}

InputProcessor.prototype.update = function()
{
    for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next())
    {
        var inputReceiver = this.entityManager.getComponent(entity, 'InputReceiver');
        inputReceiver.previousState = clone(inputReceiver.currentState);
    }
}

InputProcessor.prototype.keydown = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entityFilter = e.data[2];

    for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next())
    {
        var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
        var index = inputReceiver.currentState.keyCodes.indexOf(e.keyCode);
        if (index < 0) {
            inputReceiver.currentState.keyCodes.push(e.keyCode);
            console.log('adding ' + e.keyCode);
        }
    }
}

InputProcessor.prototype.keyup = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entityFilter = e.data[2];

    for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next())
    {
        var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
        var index = inputReceiver.currentState.keyCodes.indexOf(e.keyCode);
        if (index >= 0) {
            inputReceiver.currentState.keyCodes.splice(index, 1);
            console.log('removing ' + e.keyCode);
        }
    }
}

InputProcessor.prototype.mousemove = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entityFilter = e.data[2];

    for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next())
    {
        var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
        inputReceiver.currentState.mousePosition.x = e.clientX;
        inputReceiver.currentState.mousePosition.y = e.clientY;
    }
}

InputProcessor.prototype.mousedown = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entityFilter = e.data[2];

    for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next())
    {
        var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
        if(e.which == 1)
            inputReceiver.currentState.buttons.left = true;
        if(e.which == 3)
            inputReceiver.currentState.buttons.right = true;
    }
}

InputProcessor.prototype.mouseup = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
    var entityFilter = e.data[2];

    for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next())
    {
        var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
        if(e.which == 1)
            inputReceiver.currentState.buttons.left = false;
        if(e.which == 3)
            inputReceiver.currentState.buttons.right = false;
    }
}
