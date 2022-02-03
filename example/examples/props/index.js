import React from 'react'
import { useRoutes, Link } from '../../../src'
import style from './style'

const routes = {
    '/a': (params, match, props) => <div>Props = {props.foo}</div>, // pattern    
}

const DefaultComponent = () => <div>Default Component</div>

export default function Example() {

    const route = useRoutes(routes, null, { foo: 'bar' })

    return (
        <>
            <nav>
                <Link style={style.navItem} to='/a'>Route component with props</Link>
            </nav>
            <div style={style.routeContainer}>
                {route || <DefaultComponent />}
            </div>
        </>
    )
}