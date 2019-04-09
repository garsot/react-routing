import React from 'react'
import { useRoutes, Link } from '@kemsu/react-routing'
import style from './style'

const Child1 = () => console.log('render: Child1') || <div>Child 1</div>
const Child2 = () => console.log('render: Child2') || <div>Child 2</div>

const subroutes = {
    '/parent/child1': () => <Child1 />,
    '/parent/child2': () => <Child2 />
}

function WithSubroutes() {

    console.log('render: WithSubroutes')

    const route = useRoutes(subroutes)

    return (
        <>
            <nav>
                <Link style={style.navItem} to='/parent/child1'>To Child 1</Link>
                <Link style={style.navItem} to='/parent/child2'>To Child 2</Link>
            </nav>
            <main style={style.routeContainer}>
                {route || <DefaultComponent />}
            </main>
        </>
    )
}


const routes = {
    '/parent/*': () => <WithSubroutes />
}

const DefaultComponent = () => <div>Default Component</div>

export default function Example() {

    console.log('render: Example')

    const route = useRoutes(routes)

    return (
        <>
            <nav>
                <Link style={style.navItem} to='/parent'>To Parent</Link>
            </nav>
            <main>
                {route || <DefaultComponent />}
            </main>
        </>
    )
}