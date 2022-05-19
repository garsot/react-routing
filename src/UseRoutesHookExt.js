import { HistoryManager } from './HistoryManager'
import { parseUrl } from './parseUrl'

/**
 * Class used in useRoutes hook
 */
export class UseRoutesHookExt {

    constructor(routes, routeTreeID, setRoute) {
        this.routes = routes
        this.routeTreeID = routeTreeID
        this.onUrlChange = route => {
            setRoute(route)
        }

        this.handleHistoryChange = this.handleHistoryChange.bind(this)
        this.handleEffect = this.handleEffect.bind(this)
    }

    shallowEqual(obj1 = {}, obj2 = {}) {

        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        if (keys1.length !== keys2.length) return false

        return keys1.every(key => obj1[key] === obj2[key])
    }

    getTargetRoute() {

        let currentUrl = location.pathname

        for (let route of this.routes) {

            let { path = ['/*'], target } = route

            if (!target) throw new Error("The property 'target' is required!")

            if (!(path instanceof Array)) {
                path = [path]
            }

            for (let p of path) {

                let parseResult = parseUrl(p, currentUrl)

                if (!parseResult) continue

                if (typeof target === 'string') {

                    Object.entries(parseResult.params)
                        .forEach(([paramName, paramValue]) => {
                            target = target.replace(new RegExp('/' + paramName, 'g'), paramValue)
                        })

                    if(target.endsWith('/*') && parseResult.tail) {
                        target = target.slice(0, -2)
                        target +=  parseResult.tail
                    }

                    window.history.replaceState({}, null, target)
                    currentUrl = target

                    continue
                }

                return { target, parseResult }
            }
        }

        return {}
    }

    handleHistoryChange() {

        const targetRoute = this.getTargetRoute()
        this.lastRoute = this.lastRoute || {}

        if (targetRoute.target === this.lastRoute.target && (
            !targetRoute.target || this.shallowEqual(targetRoute.parseResult.params, this.lastRoute.parseResult.params)
        )) return

        this.lastRoute = targetRoute

        this.onUrlChange(targetRoute)

        return false
    }

    handleEffect() {
        HistoryManager.on(this.handleHistoryChange, this.routeTreeID)
        return () => {
            HistoryManager.off(this.handleHistoryChange, this.routeTreeID)
        }
    }
}