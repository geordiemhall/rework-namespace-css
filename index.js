// WF Prefixer
// -------------------------

// Built on Rework. Can prefix selectors and classes.
// Options:
// 
// 		class: all classes will have this string prepended to them
// 		selector: all selectors will have this string prepended to them (except html) 
// 		namespaceHtml: should html have prefix appended to it directly? or with a space (eg. descendant)?
// 		namespaceBody: should body selectors also have a non-body prefixed version 

// TODO @geordiemhall: Implement keyframes option 

var walk = require('rework-walk');


module.exports = function prefix(options) {

	var opts = options || {}

	return function prefix(style) {
		
		function prefixSelector(selector){

			var sel = selector

			if (opts.namespaceBody !== false){

				// Replace body with .body
				sel = sel.replace(/(?:\s+|^)body(?:\s+|$|\.|\:){1}/, function(s){ 
					return s.replace('body', '.body')
				})

			}

			if (opts.namespaceHtml !== false){

				// Replace html with .html
				sel = sel.replace(/(?:\s+|^)html(?:\s+|$|\.|\:){1}/, function(s){ 
					return s.replace('html', '.html')
				})

			}

			if (opts.selector){

				var root = 'html' || opts.root

				// TODO: This method would only replace the first instance of root, 
				// so there is a rare bug when there are two classes that both contain root.
				// eg. if root is 'html' and an element has the class .html5.html

				// Add prefix to selector, adding it to the .html part instead of prepending if needed
				if (sel.indexOf(root) >= 0){
					sel = sel.replace(root, root + opts.selector)
				} else {
					sel = opts.selector + ' ' + sel
				}

			}

			return sel

		}

		function prefixClasses(selector){

			return selector.split('.').join('.'+(opts.class || ''))

		}

		// Walk all styles
		walk(style, function(rule, node) {

			// Don't touch keyframes or font-face
			if (!rule.selectors || rule.selectors.toString().indexOf('@') >= 0) 
				return rule;

			// console.log('walking style!', rule.selectors.toString())

			rule.selectors = rule.selectors.map(function(selector) {
				return prefixSelector(prefixClasses(selector))
			});

		});

	}

};