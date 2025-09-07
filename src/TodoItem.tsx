import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate, editingId, setEditingId }) => {
  const [editText, setEditText] = useState(todo.text);

  const isEditing = editingId === todo.id;

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText(todo.text); // 変更をキャンセル
    }
  };
  
  // editingIdが外部から変更された（別のアイテムが編集開始された）場合に、
  // 自分の編集内容をリセットするための副作用
  useEffect(() => {
    if (editingId !== todo.id) {
      setEditText(todo.text);
    }
  }, [editingId, todo.id, todo.text]);


  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="edit-input"
          />
          <button onClick={handleSave} className="save-btn">Save</button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="checkbox"
          />
          <span className="todo-text">{todo.text}</span>
          <div className="button-group">
            <button onClick={() => setEditingId(todo.id)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(todo.id)} className="delete-btn">✕</button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;