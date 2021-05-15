import React, {Component } from 'react';
import './App.css';
import ChatBot from "./ChatBot";
import Loading from './steps_components/common/Loading'
import axios from "axios";

class Answer extends Component {
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
    const url = 'http://' + window.location.hostname + ':5000/api/messages'
    console.log('base url = ' + url)
    axios
      .post(url, {
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

Answer.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined
};

const App = () => (
  <div className="page">
    <div className="block">
      <img className="image" src="nstu.png" alt=""/>
      <div className="text">
      Чат-бот НГТУ предназначен для консультаций по вопросам о поступлении абитуриентов. 
      Здесь вы можете узнать всю необходимую информацию о будущей специализации, факультете, узнать о правилах приема,
      плане набора и минимальных баллах. 
      Также наш виртуальный консультант поможет вам с выбором направления, а также подготовительных курсов по любому 
      интересующему предмету.<br/><br/>Приятного общения!
      </div>
    </div>
  <ChatBot
    botName="Чат-бот НГТУ"
    botAvatar="nstu.png"
    userAvatar="student.png"
    headerTitle="Чат-бот НГТУ"
    placeholder="Введите текст сообщения..."
    className={ChatBot}
    steps={[
      {
        id: "First",
        message: "Привет! Я чат-бот НГТУ. Готов ответить на Ваши вопросы! Чтобы пройти тест на профессиональную ориентацию, введите Тест. Чтобы получить список всех направлений, введите Все направления. Чтобы получить список всех факультетов, введите Все факультеты. Чтобы узнать о правилах приема, введите Правила приёма. Чтобы узнать о подготовительных курсах, введите Подготовительные курсы",
        trigger: "request"
      },
      {
        id: "request",
        user: true,
        trigger: "Answer"
      },
      {
        id: "Answer",
        asMessage: true,
        component: <Answer />,
        waitAction: true,
        trigger: "request"
      }
    ]}
  />
  </div>
);

export default App;
