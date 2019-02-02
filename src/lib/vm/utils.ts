export const CLICK_TAG = 'click';
export const MUSTACHE_TAG_REG = () => /\{\{\s*?(\S+)\s*?\}\}/;
export const BIND_ATTR_REG = () => /\[\w+\]/g;

export const FOR_DIRECTIVE = '*for';
export const ELSE_DIRECTIVE = '*else';
export const IF_DIRECTIVE = '*if';
export const FOR_DIRECTIVE_REG = () => /\*for/g;
export const IF_DIRECTIVE_REG = () => /\*if/g;
export const ELSE_DIRECTIVE_REG = () => /\*else/g;
export const EXPRESSION_REG = () => /^([\'\"]?[a-zA-Z-\.]+[\'\"]?)\s+([=|>|<]{2,3})\s([\'\"]?[a-zA-Z-]+[\'\"]?)$/;

export const isNodeElement = (node: Node): boolean => node.nodeType === 1;
export const isNodeText = (node: Node): boolean => node.nodeType === 3;
export const isMustacheTagText = (text: string): boolean => MUSTACHE_TAG_REG().test(text);
export const isObject = (obj: any): boolean => obj !== null && typeof obj === 'object';
export const isExpression = (exp: string): boolean => EXPRESSION_REG().test(exp);
export const isExpressionWithPrimitiveType = (exp: string): boolean => {
    if (typeof exp === 'string') {
        if (/^[\'\"]/.test(exp) && /[\'\"]$/.test(exp)) {
            return true;
        }
    } else if (typeof exp === 'number') {
        return true;
    }
    return false;
};

export const getClickMethod = (node: HTMLElement): string | null => node.getAttribute(CLICK_TAG);
export const setAttribute = (node: HTMLElement, qualifiedName: string, value: string): void => node.setAttribute(qualifiedName, value);
export const resolveExpression = (expression: string): RegExpMatchArray | null => expression.match(EXPRESSION_REG());

export const calculateExpression = (exp: string, getter: (exp: string) => any): boolean => {
    const regExpMatchArray = resolveExpression(exp);
    if (regExpMatchArray) {
        const [left, operate, right] = regExpMatchArray.slice(1);
        const leftVal = isExpressionWithPrimitiveType(left) ? left.replace(/[\'\"]+/g, '') : getter(left);
        const rightVal = isExpressionWithPrimitiveType(right) ? right.replace(/[\'\"]+/g, '') : getter(right);

        const equal = calculate([`'${leftVal}'`, operate, `'${rightVal}'`].join(' '));
        if (equal) {
            return true;
        }
    }
    return false;
};

export const calculate = (str: string): any => {
    const fn = Function;
    return new fn('return ' + str)();
};