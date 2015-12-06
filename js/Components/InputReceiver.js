function InputState()
{
    this.mousePosition = new THREE.Vector2();
    this.buttons = {
        left: false,
        right: false
    };

    this.keyCodes = new Array();
}

var InputReceiver =
{
    currentState: new InputState(),
    previousState: new InputState()
};
