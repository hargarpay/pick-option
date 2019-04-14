const {createPolyfillsTransformerFactory} = require('typescript-polyfills-generator');

const getCustomTransformers = () => {
    return {
        before: [
            createPolyfillsTransformerFactory({
                targets: 'last 2 version, ie < 11, ie_mob < 11, safari >= 9',
                polyfills: {
                    'es6.array.for-each': false,
                    'es6.map': false,
                    'es6.array.map': false,
                    'es6.array.filter': false,
                    'element.closest': 'element-closest'
                }
            })
        ]
    }
}

module.exports = getCustomTransformers;