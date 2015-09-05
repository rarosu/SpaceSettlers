function VehicleProcessor(entityManager, ticker)
{
    this.entityManager = entityManager;
    this.ticker = ticker;
}

VehicleProcessor.prototype.update = function()
{
    var entities = this.entityManager.getEntitiesByProcessor(this);
    for (var i = 0; i < entities.length; i++)
    {
        var transform = this.entityManager.getComponent(entities[i], 'Transform');
        var vehicle = this.entityManager.getComponent(entities[i], 'Vehicle');
        var inventory = this.entityManager.getComponent(entities[i], 'Inventory');

        switch (vehicle.state)
        {
            case VehicleState.Running:
            {
                if (new THREE.Vector3().subVectors(transform.position, vehicle.orders[vehicle.currentOrder].station).lengthSq() < 0.01)
                {
                    // At new destination!
                    switch (vehicle.orders[vehicle.currentOrder].action)
                    {
                        case VehicleActions.Load:
                        {
                            vehicle.state = VehicleState.Load;
                        }

                        case VehicleActions.Unload:
                        {
                            vehicle.state = VehicleState.Unload;
                        }

                        case VehicleActions.UnloadAndLoad:
                        {
                            vehicle.state = VehicleState.Unload;
                        }
                    }
                }

                var direction = new THREE.Vector3().subVectors(vehicle.orders[vehicle.currentOrder].station, transform.position).normalize();
                transform.position.add(direction.multiplyScalar(vehicle.speed));
            }

            case VehicleState.Loading:
            {

            }

            case VehicleState.Unloading:

            {

            }
        }

        if(vehicle.state === VehicleState.Loading)
        {
            if(inventory.currentLoad < inventory.maxLoad)
            {
                inventory.currentLoad = Math.min(inventory.currentLoad + 10 * this.ticker.dt, inventory.maxLoad);
            }
        }
    }
}
