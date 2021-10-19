### compute only once
- Use closures
- Module Pattern

### Avoid "delete"
- assign `undefined` to the key(prefered)
- use `...` operator

### Not everything has to be flat objects
- Set
- Map
- WeakMap
***
### Cache in the browser
- Cache API (service worker)
- HTTP protocol cache

### Remove unused code
### Minification
- comments
- white lines
- white spaces
- indentation
### Gzip compression
### Keep DOM interaction to a minimum
- cache DOM elements
- batch DOM changes
### HTTP/2 instead of HTTP/1.1
- multiplexing supported, allowing multiple requests simultaneously

### Concepts
- Webpack
- Tree shaking
- momentJS / date-fns

***

### Shallow copy of object
```ts
	// Object.assign
	const objectA = { a: 1, b: 2};
	const objectB = Object.assign({}, objectA);

	// spread operator
	const objectA = { a: 1, b: 2};
	const objectB = { ...objectA };

```

### Circular dependency
- use WeakMap

- Regular Expression
- Bitmasks

***
## Factory Pattern

## Further reading
- exemplar prototypes
- concatenative inheritance
`“Program to an interface, not an implementation,” and “favor object composition over class inheritance.”`



### Concepts
- Idempotence
- First-class functions, closures, and simple lambda syntax.
