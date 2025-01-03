export const createCursorDecoration = (userId, position, color) => ({
  range: {
    startLineNumber: position.line,
    startColumn: position.column,
    endLineNumber: position.line,
    endColumn: position.column + 1
  },
  options: {
    className: `cursor-decoration-${color} cursor-${userId}`,
    hoverMessage: { value: `Cursor: ${userId}` },
    zIndex: 100
  }
});

export const randomNumber = () =>{
  return Math.floor(Math.random() * 10000000000) % 3;
}