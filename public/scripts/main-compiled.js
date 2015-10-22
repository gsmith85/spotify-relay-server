'use strict';

requirejs.config({
    paths: {
        jquery: ['https://code.jquery.com/jquery-1.11.3.min'],
        lodash: ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash'],
        react: ['https://fb.me/react-0.14.0'],
        reactDom: ['https://fb.me/react-dom-0.14.0']
    }
});

require(['jquery', 'lodash', 'react', 'reactDom'], function ($, _, React, ReactDOM) {
    var AlbumRows = React.createClass({
        displayName: 'AlbumRows',

        getInitialState: function getInitialState() {
            return { data: ['foo', 'bar'] };
        },
        componentDidMount: function componentDidMount() {
            var self = this;

            // Invoked once, both on the client and server, immediately before the initial rendering occurs.
            // If you call setState within this method, render() will see the updated state and will be executed only
            // once despite the state change.
            $.get("/json", function (data) {

                var albumNames = data.tracks.items.map(function (x, i) {
                    return x.track.album.name;
                });

                self.setState({ data: albumNames });
            });
        },
        render: function render() {
            return React.createElement(
                'div',
                null,
                this.state.data.map(function (x, i) {
                    return React.createElement(
                        'h1',
                        null,
                        x
                    );
                })
            );
        }
    });

    ReactDOM.render(React.createElement(AlbumRows, null), document.getElementById('example'));
});

//# sourceMappingURL=main-compiled.js.map