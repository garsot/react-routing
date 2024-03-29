module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2021,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "parser": "babel-eslint",
    "rules": {
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/react-in-jsx-scope": 1,
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    }
}