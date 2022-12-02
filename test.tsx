import React from 'react';
import { renderToString } from 'react-dom/server';
import Mathjax from '.';
import { ok } from 'assert';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';

describe('<Mathjax/>', function () {
    for (const expr of [
        'e = mc^2',
        '\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)',
        '',
    ]) {
        it(`renders "${expr}"`, function () {
            const tree = <Mathjax expr={expr} />;
            const html = renderToString(tree);
            ok(html.startsWith('<svg '));
            ok(html.endsWith('</svg>'));
        });
    }

    it('customizes Mathjax document object via prop', function () {
        const document = mathjax.document('', {
            InputJax: new TeX({}),
            OutputJax: new SVG({ fontCache: 'global' }),
        });
        const tree = <Mathjax expr="e = mc^2" document={document} />;
        const html = renderToString(tree);
        ok(html.startsWith('<svg '));
        ok(html.endsWith('</svg>'));
    });
});
