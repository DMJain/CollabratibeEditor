export const createCursorDecoration = (userId, position) => ({
  range: {
    startLineNumber: position.line,
    startColumn: position.column,
    endLineNumber: position.line,
    endColumn: position.column + 1
  },
  options: {
    className: `cursor-decoration cursor-${userId}`,
    hoverMessage: { value: `Cursor: ${userId}` },
    zIndex: 100
  }
});