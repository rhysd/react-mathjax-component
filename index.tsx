import React from 'react';
import type { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';
import type { LiteDocument } from 'mathjax-full/js/adaptors/lite/Document';
import { render } from './litedom';

export type Document = MathDocument<LiteElement, LiteText, LiteDocument>;

const ADAPTOR = liteAdaptor();
RegisterHTMLHandler(ADAPTOR);

export interface MathjaxProps {
    expr: string;
    document: Document;
}

const Mathjax: React.FC<MathjaxProps> = ({expr, document}) => {
    const node = document.convert(expr) as LiteElement;
    const children = render(node.children);
    return <>{children}</>;
};

export default Mathjax;
