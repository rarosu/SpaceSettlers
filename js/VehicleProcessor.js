function VehicleProcessor(entityManager, ticker)
{
    this.entityManager = entityManager;
	this.entityFilter = this.entityManager.createEntityFilter(['Transform', 'Vehicle']);
    this.ticker = ticker;
}

VehicleProcessor.prototype.update = function()
{
    for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next()) 
    {
        var transform = this.entityManager.getComponent(entity, 'Transform');
        var vehicle = this.entityManager.getComponent(entity, 'Vehicle');
        var vehicleInventory = this.entityManager.getComponent(entity, 'Inventory');

        var station =  vehicle.orders[vehicle.currentOrder].station;
        var stationTransform = this.entityManager.getComponent(station, 'Transform');
        var stationInventory = this.entityManager.getComponent(station, 'Inventory');

        switch (vehicle.state)
        {
            case VehicleState.Running:
            {
                if (new THREE.Vector3().subVectors(transform.position, stationTransform.position).lengthSq() < 0.01)
                {
                    // At new destination!
                    switch (vehicle.orders[vehicle.currentOrder].action)
                    {
                        case VehicleActions.Load:
                        {
                            vehicle.state = VehicleState.Loading;
                            break;
                        }

                        case VehicleActions.Unload:
                        {
                            vehicle.state = VehicleState.Unloading;
                            break;
                        }

                        case VehicleActions.UnloadAndLoad:
                        {
                            vehicle.state = VehicleState.Unloading;
                            break;
                        }
                    }
                }

                var direction = new THREE.Vector3().subVectors(stationTransform.position, transform.position).normalize();
                transform.position.add(direction.multiplyScalar(vehicle.speed));

                break;
            }

            case VehicleState.Loading:
            {
                var availableStorage = vehicleInventory.maxLoad - vehicleInventory.currentLoad;
                var transfer = Math.min(availableStorage, Math.min(10, stationInventory.currentLoad));

                vehicleInventory.currentLoad += transfer;
                stationInventory.currentLoad -= transfer;


                if (vehicleInventory.currentLoad == vehicleInventory.maxLoad || stationInventory.currentLoad == 0)
                {
                    vehicle.currentOrder = (vehicle.currentOrder + 1) % vehicle.orders.length;
                    vehicle.state = VehicleState.Running;
                }

                break;
            }

            case VehicleState.Unloading:
            {
                var availableStorage = stationInventory.maxLoad - stationInventory.currentLoad;
                var transfer = Math.min(availableStorage, Math.min(10, vehicleInventory.currentLoad));

                vehicleInventory.currentLoad -= transfer;
                stationInventory.currentLoad += transfer;

                if(vehicleInventory.currentLoad == 0 || stationInventory.currentLoad == stationInventory.maxLoad)
                {
                    if(vehicle.orders[vehicle.currentOrder].action === VehicleActions.UnloadAndLoad)
                    {
                        vehicle.state = VehicleState.Loading;
                    }

                    if(vehicle.orders[vehicle.currentOrder].action === VehicleActions.Unload)
                    {
                        vehicle.state = VehicleState.Running;
                        vehicle.currentOrder = (vehicle.currentOrder + 1) % vehicle.orders.length;
                    }
                }

                break;
            }
        }
    }
}
