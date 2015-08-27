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

        if (new THREE.Vector3().subVectors(transform.position, vehicle.stations[vehicle.currentDestination]).lengthSq() < 0.01)
        {
            vehicle.currentDestination = (vehicle.currentDestination + 1) % vehicle.stations.length;
        }

        var direction = new THREE.Vector3().subVectors(vehicle.stations[vehicle.currentDestination], transform.position).normalize();
        transform.position.add(direction.multiplyScalar(vehicle.speed));
    }
}
