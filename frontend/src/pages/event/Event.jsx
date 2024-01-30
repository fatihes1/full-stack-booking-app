import './Event.css'
import { Modal } from "../../components/modal/Modal";
import { Backdrop } from "../../components/backdrop/Backdrop.jsx";
import {useContext, useRef, useState} from "react";
import AuthContext from "../../context/auth-context.jsx";

export const Event = () => {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false)
    const titleRef = useRef()
    const priceRef = useRef()
    const dateRef = useRef()
    const descriptionRef = useRef()

    const { token } = useContext(AuthContext);

    const showCreateModal = () => {
        setIsShowCreateModal(true)
    }

    const handleOnCancel = () => {
        setIsShowCreateModal(false)
    }

    const handleOnConfirm = () => {
        const title = titleRef.current.value
        const price = +priceRef.current.value
        const date = dateRef.current.value
        const description = descriptionRef.current.value

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const requestBody = {
            query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
        };


        fetch('http://localhost:3003/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData)
            })
            .catch(err => {
                console.log(err);
            });

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
                            <form>
                                <div className={'form-control'}>
                                    <label htmlFor={'title'}>Title</label>
                                    <input type={'text'} id={'title'} ref={titleRef} />
                                </div>
                                <div className={'form-control'}>
                                    <label htmlFor={'price'}>Price</label>
                                    <input type={'number'} id={'price'} ref={priceRef} />
                                </div>
                                <div className={'form-control'}>
                                    <label htmlFor={'date'}>Date</label>
                                    <input type={'datetime-local'} id={'date'} ref={dateRef} />
                                </div>
                                <div className={'form-control'}>
                                    <label htmlFor={'description'}>Description</label>
                                    <textarea id={'description'} rows={'4'} ref={descriptionRef} />
                                </div>
                            </form>
                        </Modal>
                )
            }
            {
                token && (
                    <div className={'events-control'}>
                        <p>Share your own events!</p>
                        <button className={'btn'} onClick={showCreateModal}>
                            Create Event
                        </button>
                    </div>
                )
            }
            <ul className={'events__list'}>
                <li className={'events__list-item'}></li>
            </ul>
        </>
    )
}