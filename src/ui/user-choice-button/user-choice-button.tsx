import * as styles from "../poll-user-choice/poll-user-choice.css";
import {db, getCount, incrementCounter} from "../../bridge/database";
import * as React from "react";
import {button} from "../chat-bubble-wrapper/chat-bubble-wrapper.css";
import {userChoiceContainer} from "../poll-user-textinput/poll-user-textinput.css";

interface UserChoiceProps {
    changeBubbleClass: any,
    onResize: any,
    choiceNr: number,
    databaseRefs: any[];
    choices: any[];
    userClickedChoiceButton: any;
    showIsLoading: any;
}


export const UserChoiceButton: React.SFC<UserChoiceProps> = (props) => {
    return (
        <button
            className={styles.bubblePollButtons}
            onClick={
                () => {
                    // return Fake Data if defined in config
                    if(!USE_FAKE_DATA) {
                        incrementCounter(db, props.databaseRefs[props.choiceNr], 10);
                        let iterable = props.databaseRefs.map((val) => getCount(val));
                        Promise.all(iterable)
                            .then((counts) => {
                                props.userClickedChoiceButton(counts);
                                props.changeBubbleClass!('bubble-right');
                                props.onResize();
                            })
                            .catch(() => console.log('couldnt get answer data'))
                        props.showIsLoading();
                    }
                    else {
                        props.userClickedChoiceButton([1,2,3]);
                        props.changeBubbleClass!('bubble-right');
                        props.showIsLoading();
                        setTimeout(
                            ()=>{
                                props.onResize();
                            }, 100
                        )
                    }
                }}>

            {props.choices[props.choiceNr]}
        </button>)

}