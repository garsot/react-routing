# React Routing

Routing for React using hooks

## Installation

`npm install @kemsu/react-routing`

## Example

See more examples [here](https://github.com/garsot/react-routing/tree/master/example/examples).

```jsx
import React from 'react'
import { useRoutes, Link, HistoryManager } from '@kemsu/react-routing'

const routes = {
    '/': '/pattern', // redirect
    '/pattern/:id/*': ({ id }, match) => <div> Id = {id}, Match = {match} </div>, // template with named parameters
    '@^/regexp/([-a-z]+)': (params, match) => <div> Param = {params[0]}, Match = {match} </div> // regexp 
}
// OR
/*
const routes = [
    { path: '/', target: '/pattern/42/tail' },
    { path: '/pattern/:id/*', target: ({ id }, match) => <div> Id = {id}, Match = {match} </div> }, 
    { path: new RegExp('^/regexp/([-a-z]+)'), target: (params, match) => <div> Param = {params[0]}, Match = {match} </div> }
]
*/

export default function Example() {

    const route = useRoutes(routes)   

    return (
        <React.Fragment>
            <nav>
                <Link to='/pattern/42/tail'>Pattern</Link>
                <button onClick={() => HistoryManager.push('/regexp/hello-from-regexp/tail')}>RegExp</button>
            </nav>
            <div>
                {route || <div>Default</div>}
            </div>
        </React.Fragment>
    )
}
```

---
**MIT Licensed**

