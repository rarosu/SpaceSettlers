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

}

InputProcessor.prototype.keydown = function(e)
{
    var inputProcessor = e.data[0];
    var entityManager = e.data[1];
	var entityFilter = e.data[2];
	
	for (var entity = entityFilter.first(); entity !== undefined; entity = entityFilter.next()) 
	{
		var inputReceiver = entityManager.getComponent(entity, 'InputReceiver');
		var index = inputReceiver.keyCodes.indexOf(e.keyCode);
        if (index < 0) {
			inputReceiver.keyCodes.push(e.keyCode);
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
        var index = inputReceiver.keyCodes.indexOf(e.keyCode);
        if (index >= 0) {
            inputReceiver.keyCodes.splice(index, 1);
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
        inputReceiver.mousePositionDelta.x = e.clientX - inputReceiver.mousePosition.x;
        inputReceiver.mousePositionDelta.y = e.clientY - inputReceiver.mousePosition.y;
        inputReceiver.mousePosition.x = e.clientX;
        inputReceiver.mousePosition.y = e.clientY;
        if (inputReceiver.mouseMove)
            inputReceiver.mouseMove(entity, entityManager);
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
        inputReceiver.mouseDownPosition.x = e.clientX;
        inputReceiver.mouseDownPosition.y = e.clientY;
        inputReceiver.mouseLeftDown = true;
        if (inputReceiver.mouseDown)
            inputReceiver.mouseDown(entity, entityManager);
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
        inputReceiver.mouseLeftDown = false;
    }
}
