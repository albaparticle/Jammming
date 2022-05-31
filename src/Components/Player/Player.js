import React from 'react';
import './Player.css';


export class Player extends React.Component {
    render() {
        return ( 
            <iframe 
                title='spotify-player'
                style = {{borderRadius:'12px'}}
                src = {`https://open.spotify.com/embed/track/${this.props.track}`}
                width = "100%"
                height = "380"
                frameBorder = "0"
                allowfullscreen = ""
                allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" > </iframe>
        );
    }
}