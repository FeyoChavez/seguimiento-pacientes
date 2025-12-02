import { create } from 'zustand'
import type { DraftPatient, Patient } from './types'
import { v4 as uuidv4 } from 'uuid'
import { devtools, persist } from 'zustand/middleware'

// declaramos el type
type PatientState = {
    patients: Patient[]
    activeId: Patient['id']
    addPatient: (data: DraftPatient) => void
    deletePatient: (id: Patient['id']) => void
    getPatientById: (id: Patient['id']) => void
    updatePatient: (data: DraftPatient) => void
}

const createPatient = (patient: DraftPatient) : Patient => { // creamos un id para los pacientes
    return {...patient, id: uuidv4()}
}

// asignamos el type
export const usePatientStore = create<PatientState>()(
    devtools(
        persist((set) => ({ // set, get

    patients: [],
    activeId: '',
    addPatient: (data) => {
        const newPatient = createPatient(data) 
        set((state) => ({
            patients: [...state.patients, newPatient] // aqui asignamos los datos a patients: []
        }))
    },
    deletePatient: (id) => {
        set((state) => ({
            patients: state.patients.filter(patient => patient.id !== id) // trae todos los pacientes que sean diferentes al id
        }))
    },
    getPatientById: (id) => {
        set(() => ({
            activeId: id
        }))
    },
    updatePatient: (data) => {
        set((state) => ({
            patients: state.patients.map(patient => patient.id === state.activeId ? 
                {id: state.activeId, ...data} : patient), // identificamos al paciente y : retornamos los otros pacientes para no perder la info
                activeId: ''
            }))
    }
    }), {
        name: 'patient-storage' // con esto guarda el almacenamiento en localstorage ademas del persist 
        //storage: createJSONStorage(() => sessionStorage)
    })
))