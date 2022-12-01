import React, { createElement as h } from 'react';
import type { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import type { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';
import type { LiteDocument } from 'mathjax-full/js/adaptors/lite/Document';
import { camelCase } from 'camel-case';

export type Document = MathDocument<LiteElement, LiteText, LiteDocument>;

const ADAPTOR = liteAdaptor();
RegisterHTMLHandler(ADAPTOR);

function isLiteText(node: LiteNode): node is LiteText {
    return node.kind === '#text';
}

interface LiteProps {
    style?: string;
    [key: string]: any;
}

function props(elem: LiteElement, key: number | string): LiteProps {
    const props: LiteProps = {key};
    for (const name of Object.keys(elem.attributes)) {
        props[camelCase(name)] = elem.attributes[name];
    }
    if (elem.styles !== null) {
        props.style ??= '';
        props.style += elem.styles.cssText;
    }
    return props;
}

function render(nodes: LiteNode[]): React.ReactNode[] {
    return nodes.map((node, idx) => {
        if (isLiteText(node)) {
            return node.value;
        } else {
            return h(node.kind, props(node, idx), ...render(node.children));
        }
    });
}

export interface MathjaxProps {
    expr: string;
    document: Document;
}

const Mathjax: React.FC<MathjaxProps> = ({expr, document}) => {
    const node = document.convert(expr) as LiteElement;
    return <span>{render(node.children)}</span>;
};

export default Mathjax;
