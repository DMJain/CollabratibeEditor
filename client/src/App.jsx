import { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import UsersList from './components/UsersList';
import { useSocket } from './hooks/useSocket';
import { createCursorDecoration } from './utils/decorations';
import './App.css';

function App() {
  const editorRef = useRef(null);
  const [decorations, setDecorations] = useState([]);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState('// Start coding here...');
  const cursorsRef = useRef(new Map());

  const handleUsers = useCallback((updatedUsers) => {
    setUsers(updatedUsers);
  }, []);

  const handleCursorMove = useCallback(({ userId, position }) => {
    if (!editorRef.current) return;

    // Store the cursor position
    cursorsRef.current.set(userId, position);

    // Create decorations for all cursors
    const newDecorations = Array.from(cursorsRef.current.entries())
      .map(([id, pos]) => createCursorDecoration(id, pos));

    // Update decorations
    const applied = editorRef.current.deltaDecorations(decorations, newDecorations);
    setDecorations(applied);
  }, [decorations]);

  const handleCodeUpdate = useCallback((code) => {
    if (!editorRef.current) return;
    
    const currentPosition = editorRef.current.getPosition();
    setContent(code);
    
    // Restore cursor position after content update
    if (currentPosition) {
      setTimeout(() => {
        editorRef.current?.setPosition(currentPosition);
      }, 0);
    }
  }, []);

  const socket = useSocket({
    onUsers: handleUsers,
    onCursorMove: handleCursorMove,
    onCodeUpdate: handleCodeUpdate
  });

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      socket.emit('cursorMove', {
        line: e.position.lineNumber,
        column: e.position.column
      });
    });
  };

  const handleEditorChange = (value) => {
    if (value !== undefined) {
      setContent(value);
      socket.emit('codeChange', value);
    }
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <h1>Collaborative Editor</h1>
        <UsersList users={users} />
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={content}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            cursorStyle: 'line'
          }}
        />
      </div>
    </div>
  );
}

export default App;