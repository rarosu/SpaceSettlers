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
     * Loads the files specified by the given manifest object.
     */
    ResourceLoader.prototype.load = function(manifest, successCallback, errorCallback)
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
        Q.allSettled(promises).then(function(result) {
            // Success.
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
            
            successCallback();
        }, function(error) {
            // Error.
            errorCallback(error);
        }, function(progress) {
            // Progress.
            // TODO: Check whether this is actually called by all, and what the value is in that case.
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
                console.log("Successfully loaded texture: " + url);
                _this.loadedCount++;
                deferred.resolve({ manifestEntry: manifestEntry, resource: texture });
            }, function(xhr) {
                // Progress.
                deferred.notify(xhr.loaded / xhr.total);
            }, function(xhr) {
                // Error.
                console.log('Failed to load texture: ' + url);
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
