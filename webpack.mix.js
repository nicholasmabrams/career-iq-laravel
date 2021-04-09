const mix = require('laravel-mix');

const {
    /**
     * copyAssetToDirectory is a static factory method for usage without using
     * the `new` keyword to instantiate SourceToDestinationMap.
     */
    copyAssetToDirectory
} = require(
    "./source-to-destination-mapper"
);

const assetMapping = {
    alpineSourceToDestinationMap: copyAssetToDirectory(
        "resources/js/lib/alpine.min.js",
        "public/js/lib",
    ),
    appSourceToDestinationMap: copyAssetToDirectory(
        'resources/js/app.js',
        'public/js',
    ),
    appStylesSourceToDestinationMap: copyAssetToDirectory(
        'resources/css/app.css',
        'public/css',
    ),
}

mix.js(
        ...assetMapping.alpineSourceToDestinationMap,
        ...assetMapping.appSourceToDestinationMap,
).postCss(
        ...assetMapping.appStylesSourceToDestinationMap, [
            require('postcss-import'),
            require('tailwindcss'),
]);

if (mix.inProduction()) {
    mix.version();
}
