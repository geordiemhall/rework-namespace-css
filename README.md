Rework Namespace CSS
======

Namespacing plugin for Rework.

Allows for CSS to be namespaced by selector, and with class prefixes.


## Options

Pass in an options object to configure the plugin. Possible options:

`selector`: all selectors will have this string prepended to them (with a space afterwards, unless it's the root); It can be an array like ['.selector_one', '.selector_two'];

`class`: all classes will have this string prepended to them

`root`: what selector to use as the root of the namespace. Defaults to `html`. It also can be an array like ['.root_one', '.root_two']

`namespaceHtml`: whether `html` should be converted to `.html`. Useful if complete namespacing is required. Defaults to `true`.

`namespaceBody`: whether `body` should be converted to `.body`. Useful if complete namespacing is required. Defaults to `true`.

`ignore`: a list of selectors to ignore. Examle: ['body', 'html']. Default: null.

## Example

The following gulp snippet

```javascript
    var rework = require('rework')
    rework.namespace = require('rework-namespace-css')
    
    ...
    
    return gulp.src('src/styles/index.css')
        .pipe(rework(rework.namespace({ 
          selector: ['.gmh', '.fancybox'], 
          class: 'gmh-' 
        })))
        .pipe(gulp.dest('dist/styles'))
```

Will turn

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
```

Into

```css
    .html.gmh,
    .html.fancybox {
        background: red;
    }    

    .gmh .body, 
    .fancybox .body {
        color: blue;
    }

    .gmh .gmh-button,
    .fancybox .gmh-button {
        border: 1px solid black;
    }

    .gmh a.gmh-button,
    .fancybox a.gmh-button {
        border-color: red;
    }
```
