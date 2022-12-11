/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import Benchmark from 'benchmark';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { render } from './litedom';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const document = mathjax.document('', {
    InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({ fontCache: 'local' }),
});

const expr =
    '\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)';
const node = document.convert(expr) as LiteElement;

console.log('Running bench for low-layer internal rendering');
new Benchmark.Suite()
    .add('render::mathjax_stringify', function () {
        adaptor.innerHTML(node);
    })
    .add('render::react_through_litedom', function () {
        render(node.children);
    })
    .on('cycle', function (event: Event) {
        console.log(String(event.target));
    })
    .on('complete', function (this: Benchmark.Suite) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run();

console.log('\nRunning bench for initial React DOM rendering');
new Benchmark.Suite()
    .add('initial::mathjax_through_string', function () {
        const html = { __html: adaptor.innerHTML(node) };
        const elem = createElement('span', { dangerouslySetInnerHTML: html });
        renderToString(elem);
    })
    .add('initial::react_through_litedom', function () {
        const elem = createElement('span', null, ...render(node.children));
        renderToString(elem);
    })
    .on('cycle', function (event: Event) {
        console.log(String(event.target));
    })
    .on('complete', function (this: Benchmark.Suite) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run();
