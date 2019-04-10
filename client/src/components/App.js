import React, { Component } from 'react';
import './App.css';
import FeaturedPost from './FeaturedPost';
import OtherPosts from './OtherPosts';
import SpotifyContainer from './SpotifyContainer';
import * as CosmicFunctions from '../cosmicFunctions';
import Title from './Title';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
//import SearchList from './SearchList'//

const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/c6c5bd0a-a34a-43ad-9ab8-1d4eb52dc5e9/token";
const instanceLocator = "v1:us1:c6c5bd0a-a34a-43ad-9ab8-1d4eb52dc5e9";
const roomId = "30409029";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataReceived: false,
      posts: [],
      authors: [],
      featuredPostIndex: 0,
      otherPosts: [],
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  async componentDidMount() {
    const roomId = "30409029";
    try {
      const { posts, authors } = await CosmicFunctions.getCosmicJsData();
      this.setState({ dataReceived: true, posts: posts, authors: authors, otherPosts: posts.slice(1) })
    }
    catch (err) {
      console.error('Error: Problem retrieving Cosmic JS data');
      console.error(err);
      console.error(err.stack);
      this.setState({ dataReceived: false });
    }
    
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: 'bogify',
      tokenProvider: new TokenProvider({
        url: testToken
      })
    });

    chatManager.connect()
      .then(currentUser => {
        console.log("i am connected");
        this.currentUser = currentUser
        this.currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
            onMessage: message => {

              this.setState({
                messages: [...this.state.messages, message]
              })
              console.log(message);
            }
          }
        })
      })
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }

  changeFeaturedPost(index) {
    let copyOfPosts = this.state.posts.slice();
    copyOfPosts.splice(index, 1);
    this.setState({ featuredPostIndex: index, otherPosts: copyOfPosts });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          BOGIFY
        </header>
        <div className="featuredPost">
          {this.state.dataReceived ? <FeaturedPost post={this.state.posts[this.state.featuredPostIndex]} /> : ''}
        </div>
        
        <div className="spotifyPlayer">
          <SpotifyContainer />
        </div>
        <div className="otherPosts SearchList">
          <OtherPosts allPosts={this.state.posts} otherPosts={this.state.otherPosts} changeFeaturedPost={(index) => this.changeFeaturedPost(index)} />
   </div>
        <div className="chatRoom">
          <Title />
          <MessageList 
          roomId = {this.state.roomId}
          messages = {this.state.messages} />
          <SendMessageForm 
          sendMessage = {this.sendMessage} />
        </div>
        <div className="footer">
          <p>Bogify-The only way</p>
        </div>
      </div>
    );
  }
}

export default App;