import './Event.css'
import { Modal } from '../../components/modal/Modal'
import { Backdrop } from '../../components/backdrop/Backdrop.jsx'
import { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../../context/auth-context.jsx'
import { EventList } from '../../components/events/event-list/EventList.jsx'
import { Spinner } from '../../components/spinner/Spinner.jsx'

export const Event = () => {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const titleRef = useRef()
  const priceRef = useRef()
  const dateRef = useRef()
  const descriptionRef = useRef()

  const { token } = useContext(AuthContext)

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

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return
    }

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $description, price : $price, date: $date}) {
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
        `,
        variables: {
            title: title,
            description: description,
            price: price,
            date: date,
        }
    }

    fetch('http://localhost:3003/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then((resData) => {
        fetchEvents()
      })
      .catch((err) => {
        console.log(err)
      })

    setIsShowCreateModal(false)
  }

  const fetchEvents = () => {
    setIsLoading(true)
    const requestBody = {
      query: `
          query {
            events {
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
        `,
    }

    fetch('http://localhost:3003/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then((resData) => {
        const events = resData.data.events
        setEvents(events)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })
  }

  const showDetailHandler = (eventId) => {
    setSelectedEvent(events.find((e) => e._id === eventId))
  }

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null)
      return
    }
    const requestBody = {
      query: `
          mutation BookEvent($eventId: ID!) {
            bookEvent(eventId: $eventId) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
            eventId: selectedEvent._id,
        }
    }

    fetch('http://localhost:3003/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then((resData) => {
        console.log(resData)
        setSelectedEvent(null)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <>
      {isShowCreateModal && <Backdrop />}
      {isShowCreateModal && (
        <Modal
          title={'Add Event'}
          canCancel
          canConfirm
          onCancel={handleOnCancel}
          onConfirm={handleOnConfirm}
          confirmText={'Confirm'}
        >
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
      )}
      {selectedEvent && <Backdrop />}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={() => setSelectedEvent(null)}
          onConfirm={bookEventHandler}
          confirmText={token ? 'Book' : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            🏷️{selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {token && (
        <div className={'events-control'}>
          <p>Share your own events!</p>
          <button className={'btn'} onClick={showCreateModal}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList onViewDetail={showDetailHandler} events={events} />
      )}
    </>
  )
}
