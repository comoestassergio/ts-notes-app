import { NoteData, Tag } from "../App"
import { useNote } from "../layouts/NoteLayout"
import { NoteForm } from "./NoteForm"

type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {

    const note = useNote()
    
    return (
        <>
            <h1 className="mb-4">Edit note</h1>
            <NoteForm 
                onSubmit={data => onSubmit(note.id, data)} 
                onAddTag={onAddTag} 
                availableTags={availableTags} 
                title={note.title}
                tags={note.tags}
                markdown={note.markdown}
            />
        </>
    )
}