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
    const [text, setText] = useState(DEFAULT_EXPR);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        console.log(e.target.value);
        setText(e.target.value);
    };

    return <>
        <textarea id="textarea" value={text} onChange={handleChange}/>
        <div id="expression">
            <Mathjax expr={text} document={handler} />
        </div>
    </>;
};

const root = document.getElementById('react-root');
if (!root) {
    throw new Error('Mount point was not found');
}

createRoot(root).render(<App/>);
