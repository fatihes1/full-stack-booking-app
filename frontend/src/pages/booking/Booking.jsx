import { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth-context.jsx'
import {Spinner} from "../../components/spinner/Spinner.jsx";

export const Booking = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const { token, userId } = useContext(AuthContext)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setIsLoading(true)
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              event {
                  _id
                  title
                  date
                  price
              }
              createdAt
            }
          }
        `,
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
        const bookings = resData.data.bookings
        setBookings(bookings)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })
  }

  return (
    <>
        {
            isLoading ? (
            <Spinner />
            ) : bookings.length === 0 ? (
                <p>There is no booking here!</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            {booking.event.title} -{' '}
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )
        }
    </>
  )
}
