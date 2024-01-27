import React, { useCallback, useRef, useState } from "react";

export const GeneralInputBox = ({
  onChange,
  renderText,
  text,
}: {
  renderText: (text: string) => React.ReactNode;
  text: string;
  onChange: (s: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (editing) {
        onChange(inputRef.current?.value ?? "");
        setEditing(false);
      } else {
        setEditing(true);
      }
    },
    [editing, onChange]
  );

  return (
    <div>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here"
            className="input input-bordered input-xs max-w-xs"
            defaultValue={text}
          />
          <button type="submit" className="btn btn-xs">
            確定
          </button>
        </form>
      ) : (
        <div>
          {renderText(text)}
          <button onClick={() => setEditing(true)} className="btn btn-xs">
            編集
          </button>
        </div>
      )}
    </div>
  );
};

export const TextBox = ({
  onChange,
  text,
}: {
  text: string;
  onChange: (s: string) => void;
}) => {
  const renderText = useCallback(
    (text: string) => <span className="pr-1">{text}</span>,
    []
  );
  return (
    <GeneralInputBox onChange={onChange} text={text} renderText={renderText} />
  );
};

export const LinkBox = ({
  onChange,
  text,
}: {
  text: string;
  onChange: (s: string) => void;
}) => {
  const renderText = useCallback(
    (url: string) => (
      <a href={url} className="pr-1">
        リンク
      </a>
    ),
    []
  );
  return (
    <GeneralInputBox onChange={onChange} text={text} renderText={renderText} />
  );
};
