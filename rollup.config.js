import path from 'path'

import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve-with-alias'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import copy from 'rollup-plugin-copy'

import pkg from './package.json'

const srcConfig = {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        }
    ],
    external: Object.keys(pkg.peerDependencies),
    plugins: [
        babel({
            exclude: 'node_modules/**',
            ...pkg.babelOptions
        }),
        resolve(),
        commonjs()
    ]
}

const exampleConfig = {
    input: 'example/index.js',
    output: {
        file: 'example/dist/bundle.js',
        format: 'iife',
        sourcemap: true
    },
    plugins: [
        copy({
            'example/index.html': 'example/dist/index.html',
            verbose: true
        }),
        babel({
            exclude: 'node_modules/**',
            ...pkg.babelOptions
        }),
        resolve({
            alias: {
                "@kemsu/routing": path.resolve(__dirname, "src")
            }
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        commonjs({
            namedExports: {
                'react': ['useState', 'useEffect', 'useMemo', 'createContext', 'useContext', 'forwardRef']
            }
        }),

        process.env.RUN_EXAMPLE
        &&
        serve({
            historyApiFallback: true,
            contentBase: 'example/dist',
            port: 8080,
            open: true,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })

    ]
}

export default (process.env.RUN_EXAMPLE ? exampleConfig : srcConfig)

