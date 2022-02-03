import React from 'react'
import { useRoutes, Link, HistoryManager } from '../../../src'
import style from './style'

const routes = {
    '/': '/pattern/42/tail', // redirect
    '/pattern/:id/*': ({ id }, match) => <div> Id = {id}, Match = {match} </div>, // pattern
    '@^/regexp/([-a-z]+)': (params, match) => <div> Param = {params[0]}, Match = {match} </div> //regexp
}
// OR
/*
const routes = [
    { path: '/', target: '/pattern/42/tail' },
    { path: '/pattern/:id/*', target: ({ id }, match) => <div> Id = {id}, Match = {match} </div> }, 
    { path: new RegExp('^/regexp/([-a-z]+)'), target: (params, match) => <div> Param = {params[0]}, Match = {match} </div> }
]
*/

const DefaultComponent = () => <div>Default Component</div>

export default function Example() {

    const route = useRoutes(routes)   

    return (
        <>
            <nav>
                <Link style={style.navItem} to='/pattern/42/tail'>Pattern</Link>
                <button style={style.navItem} onClick={() => HistoryManager.push('/regexp/hello-from-regexp/tail')}>RegExp</button>
            </nav>
            <div style={style.routeContainer}>
                {route || <DefaultComponent />}
            </div>
        </>
    )
}