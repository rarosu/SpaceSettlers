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

var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_S = 83;
var KEYCODE_D = 68;
