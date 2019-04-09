import React, { useState, useEffect, useCallback, createElement } from 'react'

import SimpleExample from './examples/simple'
import SubroutesExample from './examples/subroutes'

const examples = {
    'Simple': SimpleExample,
    'Subroutes': SubroutesExample
}

export default function App() {    

    const [example, setExample] = useState(() => localStorage.getItem('example') || '')
    const handleSelectChange = useCallback(e => setExample(e.target.value))
    
    useEffect(() => {
        localStorage.setItem('example', example)
    }, [example])

    const ExampleComponent = examples[example]

    return (
        <>
            <select value={example} onChange={handleSelectChange}>
                <option value=''>Choose example...</option>
                {Object.keys(examples).map(key => <option key={key} value={key}>{key}</option>)}
            </select>
            <hr/>
            <main>
                {ExampleComponent ? createElement(ExampleComponent) : <div>Choose an example from the drop-down list above.</div>}
            </main>
        </>
    )
}