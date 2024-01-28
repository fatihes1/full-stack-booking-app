import './Event.css'
import { Modal } from "../../components/modal/Modal";
import { Backdrop } from "../../components/backdrop/Backdrop.jsx";
import {useState} from "react";

export const Event = () => {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false)

    const showCreateModal = () => {
        setIsShowCreateModal(true)
    }

    const handleOnCancel = () => {
        setIsShowCreateModal(false)
    }

    const handleOnConfirm = () => {
        setIsShowCreateModal(false)
    }

    return (
        <>
            {
                isShowCreateModal && (<Backdrop />)
            }
            {
                isShowCreateModal && (
                        <Modal title={"Add Event"} canCancel canConfirm onCancel={handleOnCancel} onConfirm={handleOnConfirm}>
                            <p>Modal Content here!</p>
                        </Modal>
                )
            }
            <div className={'events-control'}>
                <p>Share your own events!</p>
                <button className={'btn'} onClick={showCreateModal}>
                    Create Event
                </button>
            </div>
        </>
    )
}