import React from 'react'
import { useRoutes, Link, HistoryManager } from '@kemsu/routing'


const style = {
    border: '1px solid black',
    padding: '4px',
    margin: '4px'
}

function MainPage() {

    console.log('render: MainPage')

    return <div style={style}>Main Page</div>
}

function PageA({ id }) {

    console.log('render: PageA')

    return <div style={style}>Page A: {id}</div>
}

function SubpageB1() {

    console.log('render: SubpageB1')

    return <div>Subpage B 1</div>
}
function SubpageB2() {

    console.log('render: SubpageB2')

    return <div>Subpage B 2</div>
}

// subroutes
const subroutes = {
    '/page-b/subpage-1': SubpageB1,
    '/page-b/subpage-2': SubpageB2
}

function PageB() {

    console.log('render: PageB')

    const [route] = useRoutes(subroutes, null)

    return (
        <>
            <div style={style}>Page B</div>
            <nav>
                <Link style={style} to={`/page-b/subpage-1`}>To Subpage B 1</Link>
                <Link style={style} to={`/page-b/subpage-2`}>To Subpage B 2</Link>
            </nav>
            <div style={style}>
                {route()}
            </div>
        </>
    )
}

function PageC(params) {

    console.log('render: PageC')

    return (
        <div>Page C: {params[1]}</div>
    )
}

function Page404() {

    console.log('render: Page404')

    return <div>Error 404: Page Not Found!</div>
}

function MainPageFooter() {

    console.log('render: MainPageFooter')

    return <div>Main Page Footer</div>
}

function SubpageB1Footer() {

    console.log('render: Subpage1Footer')

    return <div>Subpage 1 Footer</div>
}

function SubpageB2Footer() {

    console.log('render: Subpage2Footer')

    return <div>Subpage 2 Footer</div>
}

function DefaultPageFooter() {
    return <div>Default Page Footer</div>
}


function Nav() {

    console.log('render: Nav')

    return (
        <nav id='nav'>
            <Link style={style} to='/home'>To Main Page</Link>
            <Link style={style} to='/page-a/42'>To Page A (42)</Link>
            <Link style={style} to='/page-a/10'>To Page A (10)</Link>
            <Link style={style} to='/page-b'>To Page B</Link>
            <Link style={style} to='/page-c/42'>To Page C</Link>
            <Link style={style} to='#test-hash'>Test Hash</Link>
            <button onClick={() => HistoryManager.push('/page-d/1')}>To Page D</button>
        </nav>
    )
}

function Content() {

    console.log('render: Content')

    const [route] = useRoutes(routes, Page404)

    return (
        <div style={style}>
            {route()}
        </div>
    )
}

// parallel routes
const footerRoutes = [
    { path: '/home', target: MainPageFooter },
    { path: '/page-b/subpage-1', target: SubpageB1Footer },
    { path: '/page-b/subpage-2', target: SubpageB2Footer }
]

function Footer() {

    console.log('render: Footer')

    const [route] = useRoutes(footerRoutes, DefaultPageFooter)

    return <footer style={style}>{route()}</footer>
}

const routes = [
    { path: '/', target: '/home' }, // redirect
    { path: '/home', target: MainPage }, // exact
    { path: '/page-a/:id', execTarget: ({ id }) => <PageA id={id} /> }, // named param and execTarget
    { path: '/page-b/*', target: PageB }, // tail
    { path: new RegExp('^/page-c(?:/(\\d+))?$'), target: PageC }, // regexp
    // or
    //{ path: /^\/page-c(?:\/(\d+))?$/, target: PageC }, // regexp
    {
        path: '/page-d/:id',
        execTarget: ({ id }) => {
            if (id === '1') return () => <div>Page D (1)</div>
            else if (id === '2') return () => <div>Page D (2)</div>
            return Page404
        }
    } // another example of execTarget
]

export default function App() {

    console.log('render: App')

    return (
        <>
            <Nav />
            <Content />
            <Footer />
            <Link to="#nav" id='test-hash' style={{ display: 'block', marginTop: window.innerHeight * 2 }}>
                HASH TESTED. BACK PLEASE.
            </Link>
        </>
    )
}