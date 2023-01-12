import 'bootstrap/dist/css/bootstrap.min.css'
import { useMemo } from 'react'
import { Button, Container, Modal } from 'react-bootstrap'
import { Routes, Route, Navigate } from 'react-router-dom'

import { EditNote } from './components/EditNote'
import { NewNote } from './components/NewNote'
import { Note } from './components/Note'
import { NoteList } from './components/NoteList'
import { SignInScreen } from './components/SignInScreen'
import { useLocalStorage } from './hooks/useLocalStorage'
import { NoteLayout } from './layouts/NoteLayout'

import { FcGoogle } from 'react-icons/fc'

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {

  const [ notes, setNotes ] = useLocalStorage<RawNote[]>("NOTES", [])
  const [ tags, setTags ] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map( note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote ({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [ 
        ...prevNotes, 
        { ...data, id: crypto.randomUUID(), tagIds: tags.map(tag => tag.id) } 
      ]
    })
  }

  function onUpdateNote (id: string, {tags, ...data}: NoteData ) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data,  tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote (id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag (id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return {...tag, label}
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag (id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  

  return (
    <Container className={`my-4`}>
      <Routes>
        <Route 
          path='/' 
          element={<NoteList availableTags={tags} notes={notesWithTags} handleUpdate={updateTag} handleDelete={deleteTag} />} 
        />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </Container>
    
  )
}

function SignInModal () {
  return (
    <Modal show className='modal-dialog modal-dialog-centered'>
      <Modal.Header>
        <Modal.Title>Sign In To Continue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>To store the notes you make this website needs to know who you are.</p>
        <p>All of your notes will be stored on the server completely private, nobody else will be able to access them.</p>
        <Button type='button' variant='outline-secondary' className='d-flex align-items-center justify-content-center gap-3 px-4 py-2'>
          <FcGoogle className='fs-5' />
          <span>Sign In with Google</span>
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default App
