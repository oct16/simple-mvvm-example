export const CLICK_TAG = 'click';
export const MUSTACHE_TAG_REG = /\{\{\s*?(\S+)\s*?\}\}/;
export const BIND_ATTR_REG = /\[\w+\]/g;

export const FOR_DIRECTIVE = '*for';
export const FOR_DIRECTIVE_REG = /\*for/g;

export const isNodeElement = (node: Node) => node.nodeType === 1;
export const isNodeText = (node: Node) => node.nodeType === 3;
export const isMustacheTagText = (text: string) => MUSTACHE_TAG_REG.test(text);
export const isObject = (obj: any) => obj !== null && typeof obj === 'object';
export const getClickMethod = (node: HTMLElement) => node.getAttribute(CLICK_TAG);
export const setAttribute = (node: HTMLElement, qualifiedName: string, value: string) => node.setAttribute(qualifiedName, value);
