import { ChangeEvent, useCallback, useState } from "react";

export const LinkBox = ({
  onChange,
  text: initText,
}: {
  text: string;
  onChange: (s: string) => void;
}) => {
  const [url, setUrl] = useState(initText);
  const [editing, setEditing] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  const handleClick = useCallback(() => {
    if (editing) {
      onChange(url);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [editing, onChange, url]);

  return (
    <div>
      {editing ? (
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-xs max-w-xs"
          value={url}
          onChange={handleChange}
        />
      ) : (
        <a href={url} className="pr-1">
          リンク
        </a>
      )}
      <button className="btn btn-xs" onClick={handleClick}>
        {editing ? "決定" : "編集"}
      </button>
    </div>
  );
};
