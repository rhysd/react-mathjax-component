/* eslint-disable no-console */
import Benchmark from 'benchmark';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
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

new Benchmark.Suite()
    .add('mathjax::stringify', function () {
        adaptor.innerHTML(node);
    })
    .add('react::render', function () {
        render(node.children);
    })
    .on('cycle', function (event: Event) {
        console.log(String(event.target));
    })
    .on('complete', function (this: Benchmark.Suite) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    // run async
    .run({ async: true });
