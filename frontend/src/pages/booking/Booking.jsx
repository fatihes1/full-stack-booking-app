import {useContext, useEffect, useState} from 'react'
import AuthContext from '../../context/auth-context.jsx'
import {Spinner} from "../../components/spinner/Spinner.jsx";
import {BookingList} from "../../components/bookings/BookingList.jsx";
import {BookingChart} from "../../components/bookings/BookingChart.jsx";
import {BookingsControl} from "../../components/bookings/BookingsControl.jsx";

export const Booking = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [outputType, setOutputType] = useState('list')
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

  const deleteBookingHandler = (bookingId) => {
    setIsLoading(true)
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
              _id
              title
            }
          }
        `,
        variables: {
            id: bookingId,
        },
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
          setBookings((prevBookings) => {
            return prevBookings.filter((booking) => {
              return booking._id !== bookingId
            })
          });
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setIsLoading(false)
        })
  }

  const changeOutputTypeHandler = (outputType) => {
    if (outputType === 'list') {
      setOutputType('list')
    } else {
      setOutputType('chart')
    }
  }

  return (
    <>
        {
            isLoading ? (
            <Spinner />
            ) : bookings.length === 0 ? (
                <p>There is no booking here!</p>
            ) : (
                <>
                  <BookingsControl activeOutputType={outputType} onChange={changeOutputTypeHandler} />
                  <div>
                    {
                        outputType === 'list' ? (
                            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
                        ) : (
                            <BookingChart bookings={bookings} />
                        )
                    }
                  </div>
                </>
            )
        }
    </>
  )
}
