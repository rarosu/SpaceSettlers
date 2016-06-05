define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    var AssimpJSONLoader = require('External/AssimpJSONLoader');
    var Q = require('External/q');
    
    function ResourceLoader(assetRootUrl)
    {
        this.assetRootUrl = assetRootUrl;
        this.loadedCount = 0;
        this.resources = {};
        
        this.textureLoader = new THREE.TextureLoader();
    };
    
    /**
     * Return a resource by name.
     */
    ResourceLoader.prototype.get = function(name) 
    {
        return this.resources[name];
    };
    
    /**
     * Loads the files specified by the given manifest object.
     * @param {Object} manifest An array of objects with name, type and url string properties.
     * @returns {Object} A promise object that is resolved when all resources are loaded.
     */
    ResourceLoader.prototype.load = function(manifest)
    {
        var i;
        var promises = [];
        for (i = 0; i < manifest.length; i++)
        {
            var manifestEntry = manifest[i];
            var promise;
            if (manifestEntry.type === 'texture')
            {
                promise = this._getTexturePromise(manifestEntry);
            }
            else if (manifestEntry.type === 'model')
            {
                promise = this._getModelPromise(manifestEntry);
            }
            
            promises.push(promise);
        }
        
        var _this = this;
        return Q.Promise(function(resolve, reject, notify) {
            Q.allSettled(promises).then(function(result) {
                var k;
                for (k = 0; k < result.length; k++)
                {
                    if (result[k].state === 'fulfilled')
                    {
                        var loaded = result[k].value;
                        var name = loaded.manifestEntry.name;
                        _this.resources[name] = loaded.resource;
                    }
                }
                
                resolve();
            });
        });
    };
    
    ResourceLoader.prototype._getTexturePromise = function(manifestEntry)
    {
        var _this = this;
        var url = this._getPath(manifestEntry.url);
        var deferred = Q.defer();
        this.textureLoader.load(url,
            function(texture) {
                // Success.
                _this.loadedCount++;
                deferred.resolve({ manifestEntry: manifestEntry, resource: texture });
            }, function(xhr) {
                // Progress.
                deferred.notify(xhr.loaded / xhr.total);
            }, function(xhr) {
                // Error.
                deferred.reject("Failed to load texture: " + url);
            });
        return deferred.promise;
    };
    
    ResourceLoader.prototype._getModelPromise = function(manifestEntry)
    {
        var _this = this;
        var url = this._getPath(manifestEntry.url);
        var deferred = Q.defer();
        AssimpJSONLoader.load(url,
            function(scene) {
                // Success.
                _this.loadedCount++;
                deferred.resolve({ manifestEntry: manifestEntry, resource: scene });
            }, function(xhr) {
                // Progress.
                deferred.notify(xhr.loaded / xhr.total);
            }, function(error) {
                // Error.
                deferred.reject("Failed to load model: " + url + " with error\"" + error + "\"");
            });
        return deferred.promise;
    };
    
    ResourceLoader.prototype._getPath = function(relativePath)
    {
        return this.assetRootUrl + '/' + relativePath;
    };
    
    return ResourceLoader;
});
