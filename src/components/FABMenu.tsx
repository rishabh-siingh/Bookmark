
import { useState } from "react";
import { Plus, FolderPlus, Bookmark } from "lucide-react";

export default function FABMenu({ onCreateFolder, onCreateBookmark }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
      {open && (
        <>
          <button
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => { onCreateFolder(); setOpen(false); }}
          >
            <FolderPlus size={20} />
          </button>
          <button
            className="bg-green-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => { onCreateBookmark(); setOpen(false); }}
          >
            <Bookmark size={20} />
          </button>
        </>
      )}
      <button
        className="bg-black text-white p-4 rounded-full shadow-xl"
        onClick={() => setOpen(!open)}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
