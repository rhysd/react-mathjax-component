/* eslint-disable no-console */
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Mathjax from '..';

const DEFAULT_EXPR =
    '\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)';

const App: React.FC = () => {
    const [expr, setExpr] = useState(DEFAULT_EXPR);
    const [[fg, bg], setColor] = useState(['black', '#eee']);
    const ref = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setExpr(e.target.value);
    };
    const handleLight = (): void => {
        setColor(['black', '#eee']);
    };
    const handleDark = (): void => {
        setColor(['white', '#111']);
    };
    const handleRed = (): void => {
        setColor(['red', bg]);
    };
    const handleDownload = (): void => {
        if (ref.current === null) {
            return;
        }
        const b64 = btoa(unescape(encodeURIComponent(ref.current.innerHTML)));
        const a = document.createElement('a');
        a.download = 'expression.svg';
        a.href = 'data:text/html;base64,' + b64;
        a.dispatchEvent(new MouseEvent('click'));
    };

    return (
        <>
            <div id="expr-input">
                <label className="label">Input</label>
                <textarea id="expr-textarea" className="textarea" defaultValue={DEFAULT_EXPR} onChange={handleChange} />
            </div>
            <div id="expr-output">
                <label className="label">Rendered</label>
                <div id="expr" className="box" style={{ color: fg, backgroundColor: bg }} ref={ref}>
                    <Mathjax expr={expr} />
                </div>
                <div id="buttons">
                    <button className="button is-small" id="dl-button" onClick={handleDownload}>
                        Download
                    </button>
                    <button className="button is-small is-light" onClick={handleLight}>
                        Light
                    </button>
                    <button className="button is-small is-dark" onClick={handleDark}>
                        Dark
                    </button>
                    <button className="button is-small is-danger" onClick={handleRed}>
                        Red
                    </button>
                </div>
            </div>
        </>
    );
};

const root = document.getElementById('react-root');
if (!root) {
    throw new Error('Mount point was not found');
}

createRoot(root).render(<App />);
