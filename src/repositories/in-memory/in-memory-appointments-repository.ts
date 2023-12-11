import { areIntervalsOverlapping } from 'date-fns'
import { type Appointment } from '../../entities/appointment'
import { type AppointmentsRepository } from '../appointments-repository'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public items: Appointment[] = []

  async create (appointment: Appointment): Promise<void> {
    this.items.push(appointment)
  }

  async findOverlappingAppointment(starstAt: Date, endsAt: Date): Promise<Appointment | null> {
    const overlappingAppointment = this.items.find(appointment => {
      return areIntervalsOverlapping(
        { start: starstAt, end: endsAt },
        { start: appointment.startsAt, end: appointment.endsAt },
        { inclusive: true }
      )
    })

    if(!overlappingAppointment) {
        return null
    }

    return overlappingAppointment
  }
}
