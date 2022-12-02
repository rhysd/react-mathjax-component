import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import Mathjax from '..';

const handler = mathjax.document('', {
    InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({ fontCache: 'local' }),
});
const DEFAULT_EXPR = '\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)';

const App: React.FC = () => {
    const [expr, setExpr] = useState(DEFAULT_EXPR);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        console.log(e.target.value);
        setExpr(e.target.value);
    };

    return <>
        <div id="expr-input">
            <label className="label">Input</label>
            <textarea id="expr-textarea" className="textarea" defaultValue={DEFAULT_EXPR} onChange={handleChange}/>
        </div>
        <div id="expr-output">
            <label className="label">Rendered</label>
            <div id="expr" className="box">
                <Mathjax expr={expr} document={handler} />
            </div>
        </div>
    </>;
};

const root = document.getElementById('react-root');
if (!root) {
    throw new Error('Mount point was not found');
}

createRoot(root).render(<App/>);
