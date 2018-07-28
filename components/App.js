var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'dc6zaTOxFJmzC';

App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  
            
            this.setState({
              loading: true  
            });
            
            var self = this;
            this.getGifPromise(searchingText)

                .then(function(gif) {  
                
                    self.setState({  
                        loading: false,  
                        gif: gif,  
                        searchingText: searchingText  
                      });
            })

},

    getGifPromise: function(searchingText) {
        return new Promise (
            function(resolve, reject) {

                let url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
                const request = new XMLHttpRequest();
                request.open('GET', url);
                request.onload = function() {

                    if(request.status === 200) {
                        let data = JSON.parse(request.responseText).data;
                        let gif = {
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        };
                        resolve(gif);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };

                request.onerror = function() {
                    reject(new Error(
                        `XMLHttpRequest Error: ${this.statusText}`));
                };
                request.send();
            });
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
            <Gif
                loading={this.state.loading}
                url={this.state.gif.url}
                sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
});