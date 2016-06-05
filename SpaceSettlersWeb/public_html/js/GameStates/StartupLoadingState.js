define(function(require) {
    "use strict";
    
    function StartupLoadingState(manifestUrl, resourceLoader, inGameState)
    {
        this.manifestUrl = manifestUrl;
        this.resourceLoader = resourceLoader;
        this.inGameState = inGameState;
        this.areResourcesLoaded = false;
    }
    
    StartupLoadingState.prototype.enter = function()
    {
        var _this = this;
        var manifestRequest = new XMLHttpRequest();
        
        manifestRequest.onload = function(e) 
        {
            var manifest = JSON.parse(manifestRequest.responseText);
            _this.resourceLoader.load(manifest).then(function() {
                _this.areResourcesLoaded = true;
            });
        };
        
        manifestRequest.open('GET', this.manifestUrl);
        manifestRequest.send();
    };
    
    StartupLoadingState.prototype.exit = function()
    {
        
    };
    
    StartupLoadingState.prototype.update = function(ticker)
    {
        if (this.areResourcesLoaded)
        {
            return this.inGameState;
        }
    };
    
    return StartupLoadingState;
});