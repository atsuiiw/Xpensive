import { useEffect, useRef, useState } from "react";

export default function TagFilter({ tags, selectedTags, onTagsChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(tag) {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
          selectedTags.length > 0
            ? "border-indigo-300 bg-primary-soft text-accent"
            : "border-border bg-card text-muted hover:bg-hover"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        Tags
        {selectedTags.length > 0 && (
          <span className="rounded-full bg-accent text-white text-xs px-1.5 py-0.5 leading-none">
            {selectedTags.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-faint border-b border-border">
            Filter by tag
          </p>
          {tags.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No tags available</p>
          ) : (
            <ul className="max-h-60 overflow-auto py-1">
              {tags.map((tag) => {
                const checked = selectedTags.includes(tag);
                return (
                  <li key={tag}>
                    <button
                      onClick={() => toggle(tag)}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-main hover:bg-hover"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          checked
                            ? "border-accent bg-accent text-white"
                            : "border-border-strong bg-card"
                        }`}
                      >
                        {checked && (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="inline-flex rounded-full bg-surface-alt px-2 py-0.5 text-xs font-medium text-muted">
                        {tag}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
