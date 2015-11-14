function InputProcessor(entityManager)
{
    this.entityManager = entityManager;
    $(document).keydown([this,entityManager], this.keydown);
    $(document).keyup([this,entityManager], this.keyup);
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
