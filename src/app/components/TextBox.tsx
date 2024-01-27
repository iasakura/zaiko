import { ChangeEvent, useCallback, useState } from "react";

export const TextBox = ({
  onChange,
  text: initText,
}: {
  text: string;
  onChange: (s: string) => void;
}) => {
  const [text, setText] = useState(initText);
  const [editing, setEditing] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleClick = useCallback(() => {
    if (editing) {
      onChange(text);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [editing, onChange, text]);

  return (
    <div>
      {editing ? (
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-xs max-w-xs"
          value={text}
          onChange={handleChange}
        />
      ) : (
        <span className="pr-1">{text}</span>
      )}
      <button className="btn btn-xs" onClick={handleClick}>
        {editing ? "決定" : "編集"}
      </button>
    </div>
  );
};
