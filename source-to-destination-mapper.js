/**
 * SourceToDestinationMap
 * @param localSourceOrSetOfSourceToDestination [string | string[]]
 *        Overloaded argument, the source for the asset being mixed,
 *        or an array containing the source and destination.
 * @param publicDestination [string | void]
 *        If `localSourceOrSetOfSourceToDestination` exists, this
 *        should always be undefined. If the first argument is of
 *        string value, this param is needed to specify to public
 *        directory which the asset will be copied into.
 *
 * @classdesc A type and value safe helper for webpack
 *
 */
class SourceToDestinationMap {
    // Allows the determination of the overload being called.
    localSourceOrSetOfSourceToDestination;
    // The final value for local resource as a relative filepath.
    localSource;
    // The final value for public resource as a relative path (no filename needed for destination).
    publicDestination;

    constructor(
        /**
         * @param localSourceOrSetOfSourceToDestination [string | string[]]
         *
         * Formats accepted:
         * ----------------------------------------------------------------
         * 1. 'src/local/asset'
         * 2. ['src/local/asset.js', 'dist/assets/js']
         */
        localSourceOrSetOfSourceToDestination = '',
        /**
         *
         * @param publicDestination [string | void]
         * @optional
         *           If `localSourceOrSetOfSourceToDestination`
         *           is an array, this should be void. Otherwise,
         *           it should point to the destination directory
         *           'dist/assets/js'.
         */
        publicDestination) {
        this.argumentsAsArray = [...arguments];
        this.localSourceOrSetOfSourceToDestination = localSourceOrSetOfSourceToDestination;
        this.publicDestination = publicDestination;
        this.overloadCondition = this.argumentsAsArray[0];

        if (!this.ctorArgumentNormalizer(this.overloadCondition) || !this.init()) {
            throw new Error(`An error has occurred within the Class ${this.constructor.name}.
                Input received: ${JSON.stringify(this.argumentsAsArray, null, 4)}`);
        }

        // Return a type safe, normalized valid collection [.../src.js, .../dest]
        return [this.localSource, this.publicDestination];
    }

    static copyAssetToDirectory (
        localSourceOrSetOfSourceToDestination,
        destinationDirectoryPath) {
        return new SourceToDestinationMap(localSourceOrSetOfSourceToDestination, destinationDirectoryPath);
    }

    ctorArgumentNormalizer(firstArgument) {
        if (!this.isString(firstArgument) && !this.isArray(firstArgument)) {
            throw TypeError(`Invalid call to ${this.constructor.name}`);
        }

        this.argumentsMapFromIterableOverload = (
            typeof firstArgument === 'object'
            && this.isArray(firstArgument)
            && this.argumentsAsArray.filter(this.isString).length === 2
        );

        this.argumentsMapDirectlyOverload = (
            !this.argumentsMapFromIterableOverload && this.argumentsAsArray.filter(this.isString).length === 2
        );

        return !!this.argumentsMapDirectlyOverload || !!this.argumentsMapFromIterableOverload;
    }

    init() {
        if (this.argumentsMapDirectlyOverload) {
            this.localSource = this.localSourceOrSetOfSourceToDestination;

            return this.setMapFromArguments(this.localSourceOrSetOfSourceToDestination, this.publicDestination);
        } else if (this.argumentsMapFromIterableOverload) {
            this.localSource = this.argumentsMapFromIterableOverload[0];

            return this.setMapFromArguments(...this.argumentsAsArray);
        }

        return false;
    }

    setMapFromArguments(
        localSourceOrSetOfSourceToDestination,
        publicDestination
    ) {
        this.localSource = localSourceOrSetOfSourceToDestination;
        this.publicDestination = publicDestination;

        return (
            !!this.localSourceOrSetOfSourceToDestination
            && !!this.publicDestination
        );
    }

    isString = (subject) => {
        return subject.length >= 0 && typeof subject === 'string';
    };

    isArray = (subject) => {
        return subject.length >= 0 && Array.isArray(subject);
    };
}

module.exports = {
    SourceToDestinationMap,
    copyAssetToDirectory: SourceToDestinationMap.copyAssetToDirectory
};
