# React Routing

Routing for React using hooks

## Usage

The following is a simple example.

```jsx
import React from 'react'
import { useRoutes, Link, HistoryManager } from '@kemsu/react-routing'

const routes = {
    '/': '/pattern/42/tail', // redirect
    '/pattern/:id/*': ({ id, _ }) => <div> Id = {id}, Tail = {_} </div>, // pattern
    '~/regexp/([-a-z]+)': (execResult) => <div> RegExp exec result is "{execResult[1]}" </div> //regexp
}

export default function App() {
    const [route, /* params */] = useRoutes(routes, () => <div>Default Component</div>)
    return (
        <>
            <nav>                
                <Link to='/pattern/42/tail'>Pattern</Link> <br />
                <button onClick={() => HistoryManager.push('/regexp/hello-from-regexp')}>RegExp</button>
            </nav>
            {route(/* params */)}
        </>
    )
}
```

