import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

interface CustomHoverCardProps {
  triggerText: string
  title: string
  description: string
  dateText?: string
  avatarSrc: string
  avatarFallback: string
  className?: string
}

export const CustomHoverCard = ({
  triggerText,
  title,
  description,
  dateText,
  avatarSrc,
  avatarFallback,
  className = 'mx-1 cursor-pointer underline decoration-zinc-400 decoration-2 underline-offset-4',
}: CustomHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        // Hack to make the hover-card work in mobile phones as well.
        tabIndex={0}
        className={cn(
          'mx-1 cursor-pointer underline decoration-zinc-400 decoration-2 underline-offset-4',
          className,
        )}
      >
        {triggerText}
      </HoverCardTrigger>
      <HoverCardContent className='w-96 font-medium'>
        <div className='flex justify-between space-x-4'>
          <Avatar>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{title}</h4>
            <p className='m-0 text-pretty text-sm'>{description}</p>
            {dateText && (
              <div className='flex items-center pt-2'>
                <CalendarIcon className='mr-2 size-4' />
                <span className='text-xs text-muted-foreground'>
                  {dateText}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
