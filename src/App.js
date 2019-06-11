import React, { Component } from 'react';
import './App.css';
import Nav from './components/Nav';
import List from './components/List';
import Note from './components/Note';
import axios from 'axios';
import urlFor from './helpers/urlFor';
import Flash from './components/Flash';

class App extends Component {
  constructor() {
    super();
    this.state ={
      showNote: false,
      notes: [],
      note: {},
      newTag :false,
      error: ''
    };
  }

  toggleNote = () => {
    this.setState({
      showNote: ! this.state.showNote,
      note: {}
    });
  }

  getNotes = () => {
    axios.get(urlFor(''))
      .then( (res) => { 
        if (res) {
          this.setState({ notes: res.data });
        } 
      })
      .catch( (err) => console.log(err) );
  }

  getNote = (id) => {
    axios.get(urlFor(`${id}`))
      .then( (res) => { 
        console.log(res.data);
        this.setState({ note: res.data[0], showNote: true });
      })
      .catch( (err) => console.log(err) );
  }

  performSubmissionRequest = (data, id) => {
    if (id) {
      return axios.patch(urlFor(`update/${id}`), data)
    } else {
      return axios.post(urlFor('create'), data);
    }
  }

  submitNote = (data, id) => {
    this.performSubmissionRequest(data, id)
      .then( (res) => this.setState({ showNote: false}) )
      .catch( (err) => console.log(err) );
  }

  deleteNote = (id) => {
    const newNotesState = this.state.notes.filter((note) => note.id !== id);
    axios.delete(urlFor(`delete/${id}`))
      .then( (res) => {
        this.setState({ notes: newNotesState });
        this.getNotes();
      })
      .catch( (err) => console.log(err) );
  }

  showTagForm = () => {
    this.setState({ newTag: true });
  }

  closeTagForm = () => {
    this.setState({ newTag: false });
  }

  submitTag = (data, noteId) => {
    axios.post(urlFor(`/${noteId}/tags`), data)
      .then( (res) => this.getNote(noteId) )
      .catch( (err) => {
        const { errors } = err.response.data;
        if (errors.name) {
          this.setState({ error: "Missing Tag Name!" });
        } 
      });
  }

  deleteTag = (noteId, id) => {
    axios.delete(urlFor(`/${noteId}/tags/${id}`))
      .then( (res) => this.getNote(noteId) )
      .catch( (err) => console.log(err) );
  }

  resetError = () => {
    this.setState({ error: '' });
  }

  render() {
    const { showNote, notes, note, newTag, error } = this.state;

    return (
      <div className="App">
        <Nav toggleNote={this.toggleNote} showNote={showNote} />
        {error && <Flash error={error} resetError={this.resetError} />}
        { showNote ?
          <Note 
            note={note}
            submitNote={this.submitNote}
            showTagForm={this.showTagForm}
            newTag={newTag}
            closeTagForm={this.closeTagForm}
            submitTag={this.submitTag}
            deleteTag={this.deleteTag}
          /> 
          : 
          <List 
            getNotes={this.getNotes}
            notes={notes}
            getNote={this.getNote}
            deleteNote={this.deleteNote}
          /> 
        }        
      </div>
    );
  }
}

export default App;
