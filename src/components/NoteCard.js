import React from 'react';

class NoteCard extends React.Component {
	renderTags(note) {
		if (note.tags) {
			return note.tags.map( (tag, index)  =>
				<span className="note-card-tag" key={index}>
					{tag.name}
				</span>
			);
		}
	}

	render() {
		const { note, getNote, deleteNote } = this.props;

		return (
			<div className="note-card-container">
				<div className="note-card-title">
					{note.title}
				</div>
				<div className="note-card-content">
					{note.content}
				</div>
				<div className="note-card-tags">
					{this.renderTags(note)}
				</div>
				<span className="note-card-delete" onClick={() => deleteNote(note._id)}>
          <i className="material-icons">close</i>
        </span>
				<span className="note-card-edit" onClick={() => getNote(note._id)}>
          <i className="material-icons">mode_edit</i>
        </span>
			</div>
		);
	}
}

export default NoteCard