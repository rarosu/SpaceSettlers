define(function(require) {
    "use strict";
    
    function StartupLoadingState(manifestUrl, resourceLoader)
    {
        this.manifestUrl = manifestUrl;
        this.resourceLoader = resourceLoader;
        this.areResourcesLoaded = false;
        
        console.log(this.resourceLoader);
    }
    
    StartupLoadingState.prototype.enter = function()
    {
        var _this = this;
        var manifestRequest = new XMLHttpRequest();
        
        manifestRequest.onload = function(e) 
        {
            var manifest = JSON.parse(manifestRequest.responseText);
            _this.resourceLoader.load(manifest, this._resourcesSuccessfullyLoaded, this._resourcesFailedToLoad);
        };
        
        manifestRequest.open('GET', this.manifestUrl);
        manifestRequest.send();
    };
    
    StartupLoadingState.prototype.exit = function()
    {
        
    };
    
    StartupLoadingState.prototype.update = function(ticker)
    {
        
    };
    
    StartupLoadingState.prototype._resourcesSuccessfullyLoaded = function()
    {
        console.log("All resources are loaded");
        this.areResourcesLoaded = true;
    };
    
    StartupLoadingState.prototype._resourcesFailedToLoad = function(error)
    {
        
    };
    
    return StartupLoadingState;
});