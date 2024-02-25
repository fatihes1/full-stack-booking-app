import './EventList.css'
import { EventCard } from './event-item/EventCard.jsx'
export const EventList = ({ events, onViewDetail }) => {
  const allEvents = events.map((event) => {
    return <EventCard key={event._id} onDetail={onViewDetail} event={event} />
  })
  return <ul className={'events__list'}>{allEvents}</ul>
}
