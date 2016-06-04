define(function(require) {
    "use strict";
    
    var Q = require('External/q');
    
    function ResourceLoader(assetRootUrl)
    {
        this.assetRootUrl;
    };
    
    /**
     * Loads the files specified by the given manifest object.
     */
    ResourceLoader.prototype.load = function(manifest)
    {
        var i;
        var promises = [];
        for (i = 0; i < manifest.length; i++)
        {
            var manifestEntry = manifest[i];
            var promise;
            if (manifest.type === 'texture')
            {
                promise = this._getTexturePromise(manifestEntry);
            }
            else if (manifest.type === 'model')
            {
                promise = this._getModelPromise(manifestEntry);
            }
            
            promises.append(promise);
        }
        
        
    };
    
    ResourceLoader.prototype._getTexturePromise = function(manifestEntry)
    {
        
    };
    
    ResourceLoader.prototype._getModelPromise = function(manifestEntry)
    {
        
    };
    
    return ResourceLoader;
});
