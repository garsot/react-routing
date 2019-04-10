import React from 'react'
import { shallow } from 'enzyme'

import Link from '../Link'

describe('Link tests', () => {      

    beforeEach(() => {
        window.history.pushState({}, null, '/')
    })

    test('should render correctly', () => {

        const output = shallow(<Link to='/test'>Test</Link>)
        expect(output).toMatchSnapshot()
    })

    test('should call the passed onClick handler', () => {

        const handleClick = jest.fn()  

        const output = shallow(<Link to='/test' onClick={handleClick}>Test</Link>)
        output.find('a').simulate('click', { preventDefault: () => { } })
        expect(handleClick).toHaveBeenCalled()
    })

    test('should change history', () => {
        expect(window.location.pathname).toBe('/')

        const output = shallow(<Link to='/test'>Test</Link>)
        output.find('a').simulate('click', { preventDefault: () => { } })

        expect(window.location.pathname).toBe('/test')
    })

})
