import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
        this.playTrack = this.playTrack.bind(this);
    }

    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    renderPlay() {
        if (this.props.track.previewUrl) {
            return <button onClick={this.previewTrack}>Preview</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }
    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    previewTrack() {
        let audios = document.querySelectorAll('audio');
        audios.forEach(audio => audio.pause());
        let audio = document.getElementById(this.props.track.id);  
        audio.play();
    }
    playTrack() {
        this.props.onPlay(this.props.track);
    }
    
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{ this.props.track.name }</h3>
                    <p>{ this.props.track.artist } | { this.props.track.album }</p>
                </div>
                <audio id={this.props.track.id}><source src={this.props.track.previewUrl} /></audio>
                {this.renderPlay()}
                <button className="Track-play" onClick={this.playTrack}> Play </button>
                {this.renderAction()}
            </div>
        )
    }
}