import React, {Component } from 'react';
import './App.css';
import ChatBot from "./ChatBot";
import Loading from './steps_components/common/Loading'
import axios from "axios";

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: "",
      trigger: false,
      message: ""
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  request = () => {
    const self = this;
    const { request } = self.props.steps;
    axios
      .post("https://chatbot-backend-nstu.herokuapp.com/api/messages", {
        message: request.message
      })
      .then(function(response) {
        console.log(response)
        self.setState({
          loading: false,
          result: response.data.message,
          trigger: true
        });
      })
      .catch(function(error) {
        console.log(error);
        self.setState({
          loading: false,
          result: "Я не смог обработать ваше сообщение",
          trigger: true
        });
      });
  };
  componentDidMount() {
    this.request();
  }

  triggetNext() {
    this.setState({ trigger: false }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        {loading ? <Loading /> : result}
        {!loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: 5
            }}
          >
            {trigger && this.triggetNext()}
          </div>
        )}
      </div>
    );
  }
}

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined
};

const App = () => (
  <div className="page">
    <div className="block">
      <img className="image" src="nstu.png" alt=""/>
    </div>
  <ChatBot
    botName="Чат-бот НГТУ"
    botAvatar="nstu.png"
    headerTitle="Чат-бот НГТУ"
    placeholder="Введите текст сообщения..."
    className={ChatBot}
    steps={[
      {
        id: "1",
        message: "Привет! Я чат-бот НГТУ. Готов ответить на Ваши вопросы!",
        trigger: "request"
      },
      {
        id: "request",
        user: true,
        trigger: "3"
      },
      {
        id: "3",
        asMessage: true,
        component: <DBPedia />,
        waitAction: true,
        trigger: "request"
      }
    ]}
  />
  </div>
);

export default App;
