import * as React from "react";
import {FrameFunctions} from "../frame/frame";
import {ChatBubble, ChatBubbleImage, ChatBubbleLink, ChatBubblePollInt} from "../chat-bubble/chat-bubble";
import {Chapter} from "../../interfaces/script";

export interface ChatBubbleWrapperProp {
    text?: string;
    time: number;
    images?: ChatBubbleImage[];
    link?: ChatBubbleLink;
    chapterIndicator?: Chapter;
    silent?: boolean;
    notificationOnlyText?: string;
    poll?: ChatBubblePollInt;
    onResize?: ()=> void;
    frameFunctions?: FrameFunctions;
    pausePlayer?: () => void;
    startPlayer?: () => void;
    projectId?: string;
}

export interface ChatBubbleWrapperState {
    answerBubbleIsActive: boolean;
    message: string;

}

export class ChatBubbleWrapper extends React.Component<ChatBubbleWrapperProp, ChatBubbleWrapperState> {


    constructor(props) {
        super(props);
        this.state = {
            answerBubbleIsActive: false,
            message: ''
        }
        this.activateAnswerBubble= this.activateAnswerBubble.bind(this);
    }
    activateAnswerBubble(message: string){
        this.setState({
            answerBubbleIsActive: true,
            message: message
        })
    }

    render(){
        if(!this.state.answerBubbleIsActive) {
            return (
            <div>
                <ChatBubble {...this.props} activateAnswerBubble={this.activateAnswerBubble}/>

            </div>
            )
        } else{
           return <ChatBubble time={this.props.time} text={this.state.message} />
        }
    }
}
