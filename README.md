<img alt="logo" src="demo/logo.svg" /> React component for Mathjax
==================================================================
[![npm][npm-badge]][npm]
[![CI][ci-badge]][ci]

[react-mathjax-component][npm] is a package to render math expressions as [React][react] element tree with
[Mathjax][mathjax].

Basic usage is very simple. This renders $e = mc^2$. Visit [the demo page][demo] to see how it works on your browser.

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Mathjax from 'react-mathjax-component';

const root = document.getElementById('root');
createRoot(root).render(<Mathjax expr="e = mc^2"/>);
```

This package is built with the idea of converting [Mathjax's LiteDOM][litedom] into React element tree. It is

- **Clean**: No `dangerouslySetInnerHTML`. No hacky DOM manipulation.
- **Fast**: React runtime can do differential update correctly. (Single math expression consists of bunch of SVG elements)
- **Small**: No complicated hack for DOM cache and no React context value. It's a single small functional component.

## Installation

```sh
npm install --save react-mathjax-component
```

This package assumes React v16 or later and uses Mathjax 3.2 or later.

## Motivation

When you use Mathjax in React app, you would use [`dangerouslySetInnerHTML`][danger]. However it is not safe as you know.
And the React cannot do differential update for the inner HTML string.

Instead, you may use existing [several][1] [React][2] [libraries][3] [for Mathjax][4]. However all of them are relying on
hacky real DOM manipulations.

In contrast, the idea of converting [LiteDOM][litedom] into React element tree does not need such hacks. And React runtime
can do differential DOM update for the coverted React element tree.  A simple math expression consists of bunch of SVG
elements so this is important for performance.

LiteDOM is a small internal representation used by Mathjax to represent an SVG element tree. It was created to render math
expressions on non-browser environment like Node.js. Mathjax converts LiteDOM tree into HTML string. This package converts
it into React element tree instead.

## Advanced usage

### Customize Mathjax document object

By default, this package uses its own [Mathjax document object][mathjax-doc]. But you can use your own document object when
you want to customize some options (e.g. extra packages). It can be done through `document` property.

```typescript
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';

const yourDocument = mathjax.document('', {
    InputJax: new TeX({ packages: ... }), // customize packages
    OutputJax: new SVG({ fontCache: 'global' }), // customize cache strategy
});

const SomeComponent: React.FC<{expr: string}> = ({expr}) => (
    <Mathjax expr={expr} document={yourDocument} />
);
```

### Styling math expression element

React element tree returned from `<Mathjax/>` component is [a React fragment][react-fragment] which contains a SVG
element tree. So you can style it as you like with its parent element.

```typescript
const InlineMath: React.FC<{expr: string}> = ({expr}) => (
    <span className="math-inline">
        <Mathjax expr={expr} />
    </span>
);

const RedMathBlock: React.FC<{expr: string}> = ({expr}) => (
    <div className="math-block" style={{color: 'red'}}>
        <Mathjax expr={expr} />
    </div>
);
```

## API

See [the demo source](./demo/index.tsx) for the working example.

### `import Mathjax from 'react-mathjax-component'`

Signature:

```typescript
function Mathjax(props: MathjaxProps): React.ReactElement
```

This returns SVG element tree rendered by Mathjax using the given properties.

### `import type { MathjaxProps } from 'react-mathjax-component'`

Signature:

```typescript
interface MathjaxProps {
    expr: string;
    document?: Document;
}
```

`expr` is the math expression to render.

`document` is [a Mathjax document object][mathjax-doc]. Basically you don't need to set this property because this
package uses the default document object when it is not set.

### `import type { Document } from 'react-mathjax-component'`

Signature:

```typescript
type Document = MathDocument<LiteElement, LiteText, LiteDocument>;
```

Type for `document` property.

## Bug report or feature request

Please [create a new issue ticket](https://github.com/rhysd/react-mathjax-component/issues/new).

## License

This package is distributed under [the MIT license](./LICENSE.txt).


[npm]: https://www.npmjs.com/package/react-mathjax-component
[react]: https://reactjs.org/
[mathjax]: https://www.mathjax.org/
[demo]: https://rhysd.github.io/react-mathjax-component/
[litedom]: https://github.com/mathjax/MathJax-src/tree/master/ts/adaptors/lite
[danger]: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
[mathjax-doc]: https://docs.mathjax.org/en/latest/options/document.html
[react-fragment]: https://reactjs.org/docs/fragments.html
[1]: https://www.npmjs.com/package/react-mathjax
[2]: https://www.npmjs.com/package/better-react-mathjax
[3]: https://www.npmjs.com/package/mathjax-react
[4]: https://www.npmjs.com/package/@yozora/react-mathjax
[ci-badge]: https://github.com/rhysd/react-mathjax-component/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/rhysd/react-mathjax-component/actions/workflows/ci.yml
[npm-badge]: https://img.shields.io/npm/v/react-mathjax-component
