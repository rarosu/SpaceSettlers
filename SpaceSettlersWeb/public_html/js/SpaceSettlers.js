define(function(require) {
    "use strict";
    
    var ECS = require('External/ecs');
    var Ticker = require('Ticker');
    
    var Transform = require('Components/Transform');
    var Renderable = require('Components/Renderable');
    var Camera = require('Components/Camera');
    var Vehicle = require('Components/Vehicle');
    var Inventory = require('Components/Inventory');
    var World = require('Components/World');
    var Chunk = require('Components/Chunk');
    var InputReceiver = require('Components/InputReceiver');
    var Pickable = require('Components/Pickable');
    var PickingMessage = require('Components/PickingMessage');
    var TilePickedMessage = require('Components/TilePickedMessage');
    var Selected = require('Components/Selected');
    var BuildState = require('Components/BuildState');
    
    var ResourceLoader = require('ResourceLoader');
    var InGameState = require('GameStates/InGameState');
    var StartupLoadingState = require('GameStates/StartupLoadingState');
    
    function SpaceSettlers()
    {
        this.entityManager = new ECS.EntityManager();
        this.entityManager.registerComponent('Transform', Transform);
        this.entityManager.registerComponent('Renderable', Renderable);
        this.entityManager.registerComponent('Camera', Camera);
        this.entityManager.registerComponent('Vehicle', Vehicle);
        this.entityManager.registerComponent('Inventory', Inventory);
        this.entityManager.registerComponent('World', World);
        this.entityManager.registerComponent('Chunk', Chunk);
        this.entityManager.registerComponent('InputReceiver', InputReceiver);
        this.entityManager.registerComponent('Pickable', Pickable);
        this.entityManager.registerComponent('PickingMessage', PickingMessage);
        this.entityManager.registerComponent('TilePickedMessage', TilePickedMessage);
        this.entityManager.registerComponent('Selected', Selected);
        this.entityManager.registerComponent('BuildState', BuildState);

        this.ticker = new Ticker();
        this.resourceLoader = new ResourceLoader('assets');
        
        // Setup game states.
        this.inGameState = new InGameState(this.entityManager, this.resourceLoader);
        this.startupLoadingState = new StartupLoadingState('assets/manifest.json', this.resourceLoader, this.inGameState);
        
        
        // Start the game in the StartupLoadingState.
        this.currentGameState = this.startupLoadingState;
        this.currentGameState.enter();

        this.ticker.start(this, this.update);
    }
    
    SpaceSettlers.prototype.update = function()
    {
        var nextState = this.currentGameState.update();
        if (nextState !== undefined)
        {
            this.currentGameState.exit();
            this.currentGameState = nextState;
            this.currentGameState.enter();
        }
    };
    
    return SpaceSettlers;
});