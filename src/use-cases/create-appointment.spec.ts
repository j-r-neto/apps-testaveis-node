import { describe, expect, it } from 'vitest'
import { CreateAppointment } from './create-appointment'
import { Appointment } from '../entities/appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository'

describe('Create Appointment', () => {
  it('should be able to create an appointment', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2022-08-12')
    const endsAt = getFutureDate('2022-08-13')

    await expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment)
  })

  it('should not be able to create an appointment with overlapping dates', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2022-08-10')
    const endsAt = getFutureDate('2022-08-15')

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })

    await expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-08-14'),
      endsAt: getFutureDate('2022-08-18')
    })).rejects.toBeInstanceOf(Error)

    await expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-08-08'),
      endsAt: getFutureDate('2022-08-12')
    })).rejects.toBeInstanceOf(Error)

    await expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-08-08'),
      endsAt: getFutureDate('2022-08-17')
    })).rejects.toBeInstanceOf(Error)

    await expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2022-08-11'),
      endsAt: getFutureDate('2022-08-12')
    })).rejects.toBeInstanceOf(Error)
  })
})
