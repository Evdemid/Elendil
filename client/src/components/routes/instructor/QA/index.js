import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import isEmpty from '../../../../validation/isEmpty';
import {
    selectQuestion,
    createQuestion,
} from '../../../../redux/actions/Question Actions';
import {
    getAnswers,
    createAnswer,
} from '../../../../redux/actions/Answer Actions';

class QA extends Component {
    //==========================================================================
    constructor(props) {
        super(props);

        this.state = {
            question: '',
            answer: '',
            cid: this.props.activeCourse._id,
            errors: {},
        };

        this.onQuestionSubmit = this.onQuestionSubmit.bind(this);
        this.onAnswerSubmit = this.onAnswerSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    //==========================================================================
    componentWillMount() {
        if (isEmpty(this.props.activeCourse)) this.props.history.push('/login');
    }
    componentDidMount() {
        this.props.questions.list.forEach(question => {
            this.props.getAnswers(question._id);
        });
    }
    //==========================================================================
    componentDidUpdate(prevProps) {
        if (
            !isEmpty(this.props.errors) &&
            this.props.errors !== prevProps.errors &&
            this.props.errors !== 'Unauthorized'
        )
            this.setState({ errors: this.props.errors });

        if (isEmpty(this.props.questions.list))
            this.props.history.push('/dashboard/course');
    }
    //==========================================================================
    questionHandler = index => this.props.selectQuestion(index);
    //==========================================================================
    onQuestionSubmit = e => {
        let newQuestion = {};
        newQuestion.text = this.state.question;
        newQuestion.cid = this.state.cid;
        this.props.createQuestion(newQuestion, this.props.history);
    };
    //==========================================================================
    onAnswerSubmit = e => {
        // e.preventDefault();
        let newAnswer = {};
        newAnswer.text = this.state.answer;
        newAnswer.qid = this.props.questions.activeQuestion._id;
        console.log(newAnswer);
        this.props.createAnswer(newAnswer, this.props.history);
    };
    //==========================================================================
    onChange = e => this.setState({ [e.target.name]: e.target.value });
    //==========================================================================
    render() {
        const qaCard = this.props.questions.list.map((q, index) => {
            let answers = [];
            this.props.answers.forEach(a => {
                if (a.qid === q._id) answers = a.answers;
            });

            const addAnswer = (
                <div className="card-body qa__answers" key={index}>
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-toggle="modal"
                        data-target="#exampleModal2">
                        Add Answer
                    </button>
                </div>
            );

            const formatted = answers.map((a, index) => (
                <div className="card-body qa__answers" key={index}>
                    {a.text}
                </div>
            ));

            return (
                <div className="card qa__question" key={index}>
                    <div
                        className="card-header qa__question--text"
                        id="headingOne">
                        <h5 className="mb-0">
                            <button
                                className="btn btn-lg btn-primary btn-block"
                                type="button"
                                data-toggle="collapse"
                                data-target={`#collapse${q.sno}`}
                                aria-expanded="true"
                                aria-controls={`collapse${q.sno}`}
                                onClick={this.questionHandler.bind(
                                    this,
                                    index,
                                )}>
                                {q.text}
                            </button>
                        </h5>
                    </div>

                    <div
                        id={`collapse${q.sno}`}
                        className="collapse"
                        aria-labelledby="headingOne"
                        data-parent="#accordionExample">
                        {addAnswer}
                        {formatted}
                    </div>
                </div>
            );
        });

        return (
            <React.Fragment>
                <div className="accordion qa" id="accordionExample">
                    <div className="qa__title">Questions & Answers</div>
                    {qaCard}
                </div>

                <div
                    class="modal fade text-dark"
                    id="exampleModal2"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModal2Label"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModal2Label">
                                    Add an Answer:
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form noValidate onSubmit={this.onAnswerSubmit}>
                                <div class="modal-body">
                                    <input
                                        type="text"
                                        name="answer"
                                        className="form-control"
                                        value={this.state.answer}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div class="modal-footer">
                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        data-dismiss="modal">
                                        Close
                                    </button>
                                    <input
                                        type="submit"
                                        class="btn btn-primary"
                                        value="Submit"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal">
                    Ask a Question
                </button>

                <div
                    class="modal fade text-dark"
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    Ask a Question:
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form noValidate onSubmit={this.onQuestionSubmit}>
                                <div class="modal-body">
                                    <input
                                        type="text"
                                        name="question"
                                        className="form-control"
                                        value={this.state.question}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div class="modal-footer">
                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        data-dismiss="modal">
                                        Close
                                    </button>
                                    <input
                                        type="submit"
                                        class="btn btn-primary"
                                        value="Submit"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
//==============================================================================
const mapStateToProps = state => ({
    activeCourse: state.courses.activeCourse,
    questions: state.questions,
    answers: state.answers,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    { selectQuestion, createQuestion, getAnswers, createAnswer },
)(withRouter(QA));