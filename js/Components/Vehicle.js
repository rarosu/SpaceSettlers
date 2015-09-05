VehicleState = {
    Running: 0,
    Loading: 1,
    Unloading: 2
}

VehicleActions = {
    Load: 0,
    Unload: 1
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
    currentDestination: 0,
    state: VehicleState.Running
};
