import { EventCard } from '@/components/events/event-card'
import type { EventItem } from '@/lib/events'

interface EventsListProps {
  events: EventItem[]
}

export function EventsList({ events }: EventsListProps) {
  return (
    <div className='flex flex-col gap-8'>
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} priority={index === 0} />
      ))}
    </div>
  )
}
