import assert from 'assert'

import { isObject, isMustacheTagText, isExpression, isExpressionWithPrimitiveType } from '../lib/vm/utils'

describe('vm core', () => {
    describe('#utils', () => {
        it('isObject', () => {
            assert.equal(isObject({}), true)
            assert.equal(isObject([]), true)
            assert.equal(isObject(123), false)
            assert.equal(isObject('123'), false)
            assert.equal(isObject(false), false)
        })

        it('isMustacheTagText', () => {
            assert.equal(isMustacheTagText('{{ abc }}'), true)
        })

        it('isExpression', () => {
            assert.equal(isExpression('abc === cde'), true)
            assert.equal(isExpression('abc === "abc"'), true)
            assert.equal(isExpression('hello === "world"'), true)
        })

        it('isExpressionWithPrimitiveType', () => {
            assert.equal(isExpressionWithPrimitiveType('"123"'), true)
            assert.equal(isExpressionWithPrimitiveType('"asd123"'), true)
            assert.equal(isExpressionWithPrimitiveType('abcd'), false)
        })

        // TODO MORE TESTS ...
        // TODO MORE TESTS ...
        // TODO MORE TESTS ...
    })
})
