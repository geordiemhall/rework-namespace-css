// WF Prefixer
// -------------------------

// Forked by @pvoznyuk
// Added ability to add multiple selectors & roots

// Built on Rework. Can prefix selectors and classes.
// Options:
// 
// 		class: all classes will have this string prepended to them
// 		selector: all selectors will have this string prepended to them (except html) 
// 		namespaceHtml: should html have prefix appended to it directly? or with a space (eg. descendant)?
// 		namespaceBody: should body selectors also have a non-body prefixed version 
// 		root: the element to treat as the highest level. Defaults to html

// TODO @geordiemhall: Implement keyframes option 


var walk = require('rework-walk');


module.exports = function prefix(options) {

	var opts = options || {}
	var regBody = /(?:\s+|^)body(?:\s+|$|\.|\:){1}/
	var regHtml = /(?:\s+|^)html(?:\s+|$|\.|\:){1}/

	return function prefix(style) {
		
		function prefixSelector(selector){

			var sel = selector

			if (opts.namespaceBody !== false){

				// Replace body with .body
				sel = sel.replace(regBody, function(s){
					return s.replace('body', '.body')
				})

			}

			if (opts.namespaceHtml !== false){

				// Replace html with .html
				sel = sel.replace(regHtml, function(s){ 
					return s.replace('html', '.html')
				})

			}

			if (opts.selector){

				var root = opts.root || 'html'
				var selStack = [];

				// TODO: This method would only replace the first instance of root,
				// so there is a rare bug when there are two classes that both contain root.
				// eg. if root is 'html' and an element has the class .html5.html

				if(typeof opts.selector != 'object'){
					opts.selector = [opts.selector]
				}
				if(typeof opts.root != 'object'){
					opts.root = [opts.root]
				}

				var selRoot = getRootFromSelector(sel,root);

				for( i in opts.selector){
					// Add prefix to selector, adding it to the .html part instead of prepending if needed
					if (selRoot){
						selStack.push(sel.replace(selRoot, selRoot + opts.selector[i]));
					} else {
						selStack.push(opts.selector[i] + ' ' + sel);
					}
				}
			}

			if(selStack.length){
				return selStack.join(',');
			} else {
				return sel;
			}
		}

		function prefixClasses(selector){

			return selector.split('.').join('.'+(opts.class || ''))

		}

		function getRootFromSelector(_sel,_roots){
			for(i in _roots){
				if (_sel.indexOf(_roots[i]) >= 0){
					return _roots[i];
				}
			}
			return false;
		}

		// Walk all styles
		walk(style, function(rule, node) {

			// Don't touch keyframes or font-face
			if (!rule.selectors || rule.selectors.toString().indexOf('@') >= 0) 
				return rule;

			rule.selectors = rule.selectors.map(function(selector) {
				return prefixSelector(prefixClasses(selector))
			});

		});

	}

};