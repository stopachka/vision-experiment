const template = require('@babel/template');
const generator = require('@babel/generator');
const t = require('@babel/types')
const { createMacro } = require('babel-plugin-macros');

// TODO(stopachka)
// this will fail if index.js lives anywhere else
// because the import path is relative
// Ideally we would have this as some "workspace", or if we 
// move this into a library, I would guess the import path would be fine
// Look into more ways potentially
const implemCallee = template.expression`
  module.require('./client/implem').default
`

// TODO(stopachka)
// use uuid
let __id = 0;
const genId = () => `${__id++}`

const transform = (path, state) => {
  const node = path.node;
  path.replaceWith(
    t.callExpression(
      implemCallee({}),
      [t.stringLiteral(genId()), ...node.arguments]
    )
  );
};

module.exports = createMacro(({ state, references }) => {
  references.default.forEach(referencePath => {
    if (referencePath.parentPath.type === 'CallExpression') {
      transform(referencePath.parentPath, state);
    } else {
      throw Error(
        'Please call directly for now. Will see what we can do about this in the future'
      );
    }
  });
});