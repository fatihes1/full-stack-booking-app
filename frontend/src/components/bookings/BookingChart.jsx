import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
    }
};


export const BookingChart = ({ bookings }) => {
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = bookings.reduce((prev, current) => {
            // can be current.price
            if (current.event.price > BOOKINGS_BUCKETS[bucket].min && current.event.price <= BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        values.push(filteredBookingsCount)
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            storeColor: "rgba(220,220,220,0.5)",
            highlightFill: "rgba(220,220,220,0.5)",
            highlightStore: "rgba(220,220,220,0.5)",
            data: values
        })
        values = [...values];
        values[values.length - 1] = 0;
    }

    return  (
        <>
            <div style={{
                textAlign: 'center',
                marginTop: '20px'
            }}>
                <BarChart data={chartData}  />
            </div>
        </>
    )
};