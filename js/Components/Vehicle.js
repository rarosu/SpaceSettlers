VehicleState = {
    Running: 0,
    Loading: 1,
    Unloading: 2
}

VehicleActions = {
    Load: 0,
    Unload: 1,
    UnloadAndLoad: 2
}

function Order(station, action)
{
    this.station = station;
    this.action = action;
}

/**
    Used for vehicle entities.
*/
var Vehicle =
{
    acceleration: 0,
    speed: 0.1,
    orders: [],
    currentOrder: 0,
    state: VehicleState.Running
};
