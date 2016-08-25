Rework Namespace CSS
======

A simple namespacing plugin for Rework.

Allows for CSS to be namespaced by selector, and with class prefixes. 


## Options

Pass in an options object to configure the plugin. Possible options:

`selector`: all selectors will have this string prepended to them (with a space afterwards, unless it's the root)

`class`: all classes will have this string prepended to them

`root`: what selector to use as the root of the namespace. Defaults to `html`.

`namespaceHtml`: whether `html` should be converted to `.html`. Useful if complete namespacing is required. Defaults to `true`.

`namespaceBody`: whether `body` should be converted to `.body`. Useful if complete namespacing is required. Defaults to `true`

`ignoreUnderscored`: whether selectors that begin with an underscore should have the underscore removed and not be namespaced. Defaults to `true`. Useful for selectors that need to break out of namespacing. Eg. `._reset {}` won't get transformed into `.namespace ._reset {}`, but as .`reset{}` instead


## Example

Note: Rework is fairly old now so the following may no longer work.

Grunt snippet to show the general idea:
```js
var reworkNamespace = require('rework-namespace-css')
grunt.initConfig({
    rework: {
        options: {
            use: [
                reworkNamespace({
                    selector: '.gmh'
                })
            ]
        },
        index: {
            'dist/styles/core.css': 'dist/styles/core-namespaced.css'
        }
    }
})
```


Gulp snippet to show the general idea (untested, may not work):
```js
var rework = require('gulp-rework')
rework.namespace = require('rework-namespace-css')

// ...

return gulp.src('src/styles/index.css')
    .pipe(rework(rework.namespace({ selector: '.gmh', class: 'gmh-' })))
    .pipe(gulp.dest('dist/styles'))
```

Will take the following CSS:
```css
html {
    background: red;
}    

body {
    color: blue;
}

.button {
    border: 1px solid black;
}

a.button {
    border-color: red;
}

._ignore-this {
    box-sizing: border-box;
}
```

And turn it into:
```css
.html.gmh {
    background: red;
}    

.gmh .body {
    color: blue;
}

.gmh .gmh-button {
    border: 1px solid black;
}

.gmh a.gmh-button {
    border-color: red;
}

.ignore-this {
    box-sizing: border-box;
}

```