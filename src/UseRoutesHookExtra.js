import HistoryManager from './HistoryManager'
import parseUrl from './parseUrl'

/**
 * Extra class for useRoutes hook
 */
export default class UseRoutesHookExtra {

    constructor(routes, defaultComponent, routeTreeID, setRoute) {
        this.routes = routes
        this.defaultComponent = defaultComponent
        this.routeTreeID = routeTreeID
        this.onUrlChange = route => {
            setRoute(route)
        }
    }

    getTargetRoute = () => {

        let currentUrl = location.pathname

        for (let route of this.routes) {

            let { path = ['/*'], target, execTarget } = route

            if (!target && !execTarget) throw new Error("The property 'target' or 'execTarget' is required!")

            if (!(path instanceof Array)) {
                path = [path]
            }

            for (let p of path) {

                let params = parseUrl(p, currentUrl)

                if (!params) continue

                if (execTarget) {
                    target = execTarget(params)
                }

                if (typeof target === 'string') {

                    window.history.pushState({}, null, target)
                    currentUrl = target

                    continue
                }

                return { component: target, params }
            }
        }

        return { component: this.defaultComponent, params: {} }
    }

    handleHistoryChange = () => {

        const targetRoute = this.getTargetRoute()

        const targetComponent = targetRoute && targetRoute.component
        const currentComponent = this.currentRoute && this.currentRoute.component

        if (targetComponent === currentComponent) return

        this.currentRoute = targetRoute

        this.onUrlChange(targetRoute)

        return false
    }

    handleEffect = () => {
        HistoryManager.on(this.handleHistoryChange, this.routeTreeID)
        return () => {
            HistoryManager.off(this.handleHistoryChange, this.routeTreeID)
        }
    }
}