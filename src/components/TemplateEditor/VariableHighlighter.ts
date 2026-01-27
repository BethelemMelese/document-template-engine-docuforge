import { Mark } from '@tiptap/core';

export const VariableMark = Mark.create({
  name: 'variable',
  
  addAttributes() {
    return {
      variableName: {
        default: null,
        parseHTML: element => element.getAttribute('data-variable'),
        renderHTML: attributes => {
          if (!attributes.variableName) {
            return {};
          }
          return {
            'data-variable': attributes.variableName,
            class: 'variable-mark',
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-variable]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  
  addCommands() {
    return {
      setVariable: (attributes: { variableName: string }) => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleVariable: (attributes: { variableName: string }) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetVariable: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});
