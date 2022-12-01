import { createElement as h } from 'react';
import type { LiteElement, LiteNode } from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';
import { camelCase } from 'camel-case';

function isLiteText(node: LiteNode): node is LiteText {
    return node.kind === '#text';
}

interface Style {
    [name: string]: string;
}

function parseStyle(text: string): Style {
    const style: Style = {};
    for (const s of text.split(';')) {
        const [name, val] = s.split(':');
        style[camelCase(name)] = val;
    }
    return style;
}

interface LiteProps {
    style?: Style;
    [key: string]: any;
}

function props(elem: LiteElement, key: number | string): LiteProps {
    const props: LiteProps = {key};
    let style = '';
    for (const name of Object.keys(elem.attributes)) {
        if (name.startsWith('data-')) {
            continue;
        } else if (name === 'style') {
            style = elem.attributes[name];
        } else {
            props[camelCase(name)] = elem.attributes[name];
        }
    }
    if (elem.styles !== null) {
        style += elem.styles.cssText;
    }
    props.style = parseStyle(style);
    return props;
}

export function render(nodes: LiteNode[]): React.ReactNode[] {
    return nodes.map((node, idx) => {
        if (isLiteText(node)) {
            return node.value;
        } else {
            return h(node.kind, props(node, idx), ...render(node.children));
        }
    });
}

