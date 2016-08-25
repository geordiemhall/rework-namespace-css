// WF Prefixer
// -------------------------

// Built on Rework. Can prefix selectors and classes.
// Options:
// 
// 		class: 			all classes will have this string prepended to them
// 		selector: 		all selectors will have this string prepended to them (except html) 
// 		namespaceHtml: 	should html have prefix appended to it directly? or with a space (eg. descendant)?
// 		namespaceBody: 	should body selectors also have a non-body prefixed version 
// 		root: 			the element to treat as the highest level. Defaults to html
// 		duplicateBody: 	body should also have a .root.body set (in addition to .)
// 		ignoreUnderscored: should any selectors that start with an underscore be ignored and their underscore removed (allows to break out of namespace)

var walk = require('rework-walk');

module.exports = function prefix(options){
	var opts = options || {}
	var regBody = /(?:\s+|^)body(?:\s+|$|\.|\:){1}/
	var regHtml = /(?:\s+|^)html(?:\s+|$|\.|\:){1}/

	return function prefix(style){
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

				// TODO: This method would only replace the first instance of root,
				// so there is a rare bug when there are two classes that both contain root.
				// eg. if root is 'html' and an element has the class .html5.html

				// Add prefix to selector, adding it to the .html part instead of prepending if needed
				if (sel.indexOf(root) >= 0){
					sel = sel.replace(root, root + opts.selector)
				} else {
					sel = opts.selector + ' ' + sel
				}

				if (opts.duplicateBody !== false && opts.namespaceBody !== false){
					if (sel.indexOf(opts.selector + ' .body') >= 0){
						sel = [ sel, sel.replace(' .body', '.body') ].join(', ')
					}
				}
			}

			if (opts.ignoreUnderscored !== false){
				// Any classes with an underscore in them are treated raw, with the underscore removed
				// eg. ._reset {} won't get prefixed as .namespace ._reset {}, but as .reset{}
				if (sel.indexOf('._') >= 0){
					sel = selector.replace(/\._/g, '.') // first instance is purposeful for now
				}
			}

			return sel
		}

		function prefixClasses(selector){
			return selector.split('.').join('.'+(opts.class || ''))
		}

		// Walk all styles
		walk(style, function(rule, node){
			// Don't touch keyframes or font-face
			if (!rule.selectors || rule.selectors.toString().indexOf('@') >= 0){
				return rule;
			}

			rule.selectors = rule.selectors.map(function(selector){
				return prefixSelector(prefixClasses(selector))
			});
		});
	}
}