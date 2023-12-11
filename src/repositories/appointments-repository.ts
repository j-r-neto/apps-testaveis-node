import { Appointment } from '../entities/appointment'

export interface AppointmentsRepository {
  create(appointment: Appointment): Promise<void>
  findOverlappingAppointment(starstAt: Date, endsAt: Date): Promise<Appointment | null>
}
