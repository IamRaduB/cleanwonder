import { Moment } from 'moment'

export interface TimelineEvent {
  when: Moment
  type: number
  info: string
}
