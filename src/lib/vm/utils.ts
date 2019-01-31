export const CLICK_TAG = 'click';
export const MUSTACHE_TAG_REG = /\{\{\s*?(\S+)\s*?\}\}/;
export const BIND_ATTR_REG = /\[\w+\]/g;

export const FOR_DIRECTIVE = '*for';
export const FOR_DIRECTIVE_REG = /\*for/g;
export const IF_DIRECTIVE_REG = /\*if/g;
export const EXPRESSION_REG = /^([\'\"]?[a-zA-Z-\.]+[\'\"]?)\s+([=|>|<]{2,3})\s([\'\"]?[a-zA-Z-]+[\'\"]?)$/;

export const isNodeElement = (node: Node): boolean => node.nodeType === 1;
export const isNodeText = (node: Node): boolean => node.nodeType === 3;
export const isMustacheTagText = (text: string): boolean => MUSTACHE_TAG_REG.test(text);
export const isObject = (obj: any): boolean => obj !== null && typeof obj === 'object';
export const isExpression = (exp: string): boolean => EXPRESSION_REG.test(exp);
export const isExpressionWithPrimitiveType = (exp: string): boolean => {
    if (typeof exp === 'string') {
        if (/^[\'\"]/.test(exp) && /[\'\"]$/.test(exp)) {
            return true;
        }
    } else if (typeof exp === 'number') {
        return true;
    }
    return false
}

export const getClickMethod = (node: HTMLElement): string | null => node.getAttribute(CLICK_TAG);
export const setAttribute = (node: HTMLElement, qualifiedName: string, value: string): void => node.setAttribute(qualifiedName, value);
export const resolveExpression = (expression: string): RegExpMatchArray | null => expression.match(EXPRESSION_REG);
