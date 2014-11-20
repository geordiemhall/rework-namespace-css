Rework Namespace CSS
======

Namespacing plugin for Rework.

Allows for CSS to be namespaced by selector, and with class prefixes.


## Options

Pass in an options object to configure the plugin. Possible options:

`selector`: all selectors will have this string prepended to them (with a space afterwards, unless it's the root)

`class`: all classes will have this string prepended to them

`root`: what selector to use as the root of the namespace. Defaults to `html`.

`not`: array of selectors to not apply the prefix class to

`namespaceHtml`: whether `html` should be converted to `.html`. Useful if complete namespacing is required. Defaults to `true`.

`namespaceBody`: whether `body` should be converted to `.body`. Useful if complete namespacing is required. Defaults to `true`


## Example

The following gulp snippet

    var rework = require('rework')
    rework.namespace = require('rework-namespace-css')
    
    ...
    
    return gulp.src('src/styles/index.css')
        .pipe(rework(rework.namespace({
          selector: '.gmh',
          not: [/^ng-/],
          class: 'gmh-'
        })))
        .pipe(gulp.dest('dist/styles'))

Will turn

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

Into

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

