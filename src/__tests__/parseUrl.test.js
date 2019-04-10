import parseUrl from '../parseUrl'

describe('parseUrl tests', () => {

    test('testing cases when url matches the path', () => {
        expect(parseUrl("/*", "/test/url")).toEqual({ params: {}, match: "/" })
        expect(parseUrl("/test/url/:id", "/test/url/42")).toEqual({ params: { id: "42" }, match: "/test/url/42" })
        expect(parseUrl("/test/url/:id/*", "/test/url/42/tail")).toEqual({ params: { id: "42" }, match: "/test/url/42" })
        expect(parseUrl(new RegExp("/test/url/(\\d+)"), "/test/url/42")).toEqual({ params: ["42"], match: "/test/url/42" })
    })   

    test('testing cases when url does not match the path', () => {
        expect(parseUrl("/foo/bar", "/test/url")).toBeNull()
        expect(parseUrl("/test/url/:id", "/test/url")).toBeNull()
        expect(parseUrl(/^\/foo/, "/test/url")).toBeNull()
    })
})