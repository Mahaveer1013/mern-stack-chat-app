import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function Flash({flash}) {
    return <>
        <div className="flash-msg-div fcc">
            <p className={flash[1] + " flash-msg"}>
                {flash[1] === 'success' ? (
                    <FontAwesomeIcon icon={faCircleCheck} />
                ) : (
                    <FontAwesomeIcon icon={faCircleExclamation} />
                )}
                &nbsp;&nbsp;{flash[0]}
            </p>
        </div>
    </> 
}