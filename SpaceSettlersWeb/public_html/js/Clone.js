define(function(require) {
    "use strict";
    
    /**
        Function for cloning arbirary objects.

        From this thread: http://stackoverflow.com/questions/728360

        @param {object} obj - The object to clone.
        @return {object} - A clone of obj.
    */
    function clone(obj)
    {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" != typeof obj)
            return obj;

        // Handle Date
        if (obj instanceof Date)
        {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array)
        {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++)
            {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object)
        {
            copy = Object.create(obj.__proto__);
            for (var attr in obj)
            {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = clone(obj[attr]);
            }

            return copy;
        }

        throw new Error("Unable to clone object. Type unsupported.");
    }
    
    return clone;
});


