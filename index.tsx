import React from 'react';
import type { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';
import type { LiteDocument } from 'mathjax-full/js/adaptors/lite/Document';
import { render } from './litedom';

export type Document = MathDocument<LiteElement, LiteText, LiteDocument>;

RegisterHTMLHandler(liteAdaptor());

let cache: Document | null = null;
function getDefaultDocument(): Document {
    if (cache !== null) {
        return cache;
    }
    const document = mathjax.document('', {
        InputJax: new TeX({ packages: AllPackages }),
        OutputJax: new SVG({ fontCache: 'local' }),
    });
    cache = document;
    return document;
}

export interface MathjaxProps {
    expr: string;
    document?: Document;
}

const Mathjax: React.FC<MathjaxProps> = ({ expr, document }) => {
    const converter = document ?? getDefaultDocument();
    const node = converter.convert(expr) as LiteElement;
    const children = render(node.children);
    return <>{children}</>;
};

export default Mathjax;
