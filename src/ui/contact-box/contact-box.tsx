import * as React from "react";
import * as styles from "./contact-box.css";
import { sendEvent } from "../../util/analytics";
import { ScriptContact } from "../../interfaces/script";
interface ContactBoxProps {
    onClose: () => void;
    source: string;
    contact?: ScriptContact;
}

export function setShowOrHideFunction(func: () => void) {
    showOrHideContactBox = func;
}

export let showOrHideContactBox: (from: string) => void;

export function ContactBox(props: ContactBoxProps) {
    // total hack shortcut to show/hide window

    if (!props.contact) {
        return null;
    }

    let contactOptions: JSX.Element[] = [];

    // if (props.contact.tel) {
    //     contactOptions.push(
    //         <a
    //             href={`tel:${props.contact.tel}`}
    //             onClick={() => {
    //                 sendEvent("Web browser", "Leave a voicemail", props.source);
    //             }}
    //         >
    //             Leave a voicemail
    //         </a>
    //     );
    // }
    if (props.contact.sms) {
        contactOptions.push(
            <a
                href={`sms:${props.contact.sms}`}
                onClick={() => {
                    sendEvent("Web browser", "Send text", props.source);
                }}
            >
                Eine SMS an Sabrina schicken
            </a>
        );
    }
    if (props.contact.email) {
        contactOptions.push(
            <a
                href={`mailto:${props.contact.email}`}
                onClick={() => {
                    sendEvent("Web browser", "Write email", props.source);
                }}
            >
                Eine E-Mail an Sabrina schicken
            </a>
        );
    }
    return (
        <div
            style={{ pointerEvents: "auto", position: "absolute", width: "100%", height: "100%", zIndex: 11 }}
        >
            <div
                className={styles.contactBoxBack}
                onClick={e => {
                    props.onClose();
                    e.stopPropagation();
                }}
            />
            <div className={styles.contactBox}>
                <h3>{props.contact!.headerContactPopUp}</h3>
                <p>
                    {props.contact!.teaserContactPopUp}
                </p>
                <ul>{contactOptions.map((el, idx) => <li key={`contactoption_${idx}`}>{el}</li>)}</ul>
            </div>
        </div>
    );
}
