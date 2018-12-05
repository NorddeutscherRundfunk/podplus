import * as styles from "./poll-user-choice.css";
import * as React from "react";
import {Component} from "react";
import {createCounter, db, getCount, incrementCounter} from "../../bridge/database";
import MDSpinner from "react-md-spinner";
import {UserChoiceButton} from "../user-choice-button/user-choice-button";

interface ChatBubblePollProperties {
    question: string;
    choices: string[];
    followUp?: string;
    pollID: string;
    showResults: boolean;
    onResize: () => void;
    projectId?: string;
    changeBubbleClass?: (string) => void;
}

interface ChatBubblePollState {
    pollSent: boolean;
    isLoading: boolean;
    databaseRefs: any[];
    value: any;
    hasError: boolean
}

export class PollUserChoice extends Component<ChatBubblePollProperties, ChatBubblePollState> {
    constructor(props) {
        super(props);
        this.state = {
            pollSent: false,
            databaseRefs: [], // Todo:fix any
            value: [],
            isLoading: false,
            hasError: false
        }
        this.setUpDatabase = this.setUpDatabase.bind(this);
        this.userClickedChoiceButton = this.userClickedChoiceButton.bind(this);
        this.showIsLoading = this.showIsLoading.bind(this);
    }

    showIsLoading() {
        this.setState({isLoading: true})
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        // You can also log the error to an error reporting service
        console.log(error, info);
    }

    setUpDatabase() {
        let refs: any[];
        refs = [];
        for (var i = 0; i < this.props.choices.length; i++) {
            let ref = db.collection(this.props.pollID).doc(this.props.choices[i]);
            const ergebnis = ref.get()
            ergebnis.then(function (value) {
                if (!value.exists) {
                    createCounter(ref, 10)
                }
            })
            refs.push(ref)
        }
        this.setState(
            {databaseRefs: refs}
        )

    }


    componentDidMount() {
        this.setUpDatabase()
    }

    checkIfHidden = () => {
        return this.state.isLoading ? styles.hiddenChatBubble : styles.bubblePollButtonsContainer
    }

    userClickedChoiceButton = (counts) => {
        this.setState({
            pollSent: true,
            value: counts,
            isLoading: false
        })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        let retVal;
        if (!this.state.pollSent) {
            retVal = (
                <div className={styles.isLoadingSpinnerContainer}>
                    <div key="poll-choice" className={this.checkIfHidden()}>
                        <div>{this.props.question}</div>

                        {
                            this.props.choices.map(
                                (choice, index) => {
                                    return <UserChoiceButton
                                        key={index}
                                        changeBubbleClass={this.props.changeBubbleClass}
                                        onResize={this.props.onResize}
                                        choiceNr={index}
                                        databaseRefs={this.state.databaseRefs}
                                        choices={this.props.choices}
                                        userClickedChoiceButton={this.userClickedChoiceButton}
                                        showIsLoading={this.showIsLoading}
                                    />
                                }
                            )
                        }

                    </div>
                    {this.state.isLoading &&
                    <div className={styles.isLoadingSpinner}>
                        <MDSpinner singleColor={'#214683'}/>
                    </div>
                    }
                </div>

            )
        } else {
            retVal = (
                <div key="text" className={styles.bubbleTextPadding}>
                    <div className={styles.bubbleText}>
                        <div>{this.props.followUp}</div>
                        {this.props.showResults == true &&
                        <div>
                            {
                            this.props.choices.map(
                            (name, index)=>{
                            return <div key={index}>
                            {this.props.choices[index]}: {calculatePercentage(index, this.state.value!)} %
                            </div>
                            }
                            )

                            }


                            {/*<div>*/}
                                {/*{this.props.choices[0]}: {calculatePercentage(calculatePercentage(index, this.state.value!))} %*/}
                            {/*</div>*/}
                            {/*<div>*/}
                                {/*{this.props.choices[1]}: {calculatePercentage(this.state.value[1], this.state.value[0])} %*/}
                            {/*</div>*/}

                        </div>
                        }

                    </div>
                </div>
            )
        }
        return retVal
    }
}


function calculatePercentage(index: number, counts: number[]) {
    let sum = counts.reduce(
        (accumulator, currentValue) => {
           return accumulator + currentValue
        }
    )
    if(sum !=0 && counts[index] != 0){
        return Math.round((counts[index] / sum ) * 100);
    } else{
        return 0
    }
}
