import './EventCard.css'
import { useContext } from 'react'
import AuthContext from '../../../../context/auth-context.jsx'
export const EventCard = ({ event, onDetail }) => {
  const authContext = useContext(AuthContext)
  return (
    <li key={event._id} className={'events__list-item'}>
      <div>
        <h1>{event.title}</h1>
        <h2>
          💰{event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {authContext.userId === event.creator._id ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button
            id={event._id}
            className={'btn'}
            onClick={onDetail.bind(this, event._id)}
          >
            View Details
          </button>
        )}
      </div>
    </li>
  )
}
