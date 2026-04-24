// Firestore service for job operations
// Design: Modern Professional Analytics - Database operations for job tracking

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { JobApplication, CreateJobInput, JobStatus } from '@/types/job';

const JOBS_COLLECTION = 'jobs';

// Convert Firestore document to JobApplication
function convertDocToJob(docData: any): JobApplication {
  return {
    id: docData.id,
    companyName: docData.companyName,
    jobTitle: docData.jobTitle,
    jobUrl: docData.jobUrl,
    status: docData.status,
    appliedDate: docData.appliedDate?.toDate() || new Date(),
    notes: docData.notes,
    salary: docData.salary,
    location: docData.location,
    createdAt: docData.createdAt?.toDate() || new Date(),
    updatedAt: docData.updatedAt?.toDate() || new Date(),
  };
}

// Get all jobs for current user
export async function getAllJobs(): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      orderBy('appliedDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      convertDocToJob({ ...doc.data(), id: doc.id })
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Get jobs by status
export async function getJobsByStatus(status: JobStatus): Promise<JobApplication[]> {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where('status', '==', status),
      orderBy('appliedDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      convertDocToJob({ ...doc.data(), id: doc.id })
    );
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    return [];
  }
}

// Add new job
export async function addJob(input: CreateJobInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      companyName: input.companyName,
      jobTitle: input.jobTitle,
      jobUrl: input.jobUrl || '',
      status: input.status || 'applied',
      notes: input.notes || '',
      salary: input.salary || '',
      location: input.location || '',
      appliedDate: input.appliedDate ? Timestamp.fromDate(input.appliedDate) : Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
}

// Update job
export async function updateJob(id: string, updates: Partial<JobApplication>): Promise<void> {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convert dates to Timestamps
    if (updates.appliedDate) {
      updateData.appliedDate = Timestamp.fromDate(updates.appliedDate);
    }

    await updateDoc(jobRef, updateData);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

// Delete job
export async function deleteJob(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, JOBS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}

// Subscribe to real-time updates
export function subscribeToJobs(
  callback: (jobs: JobApplication[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      orderBy('appliedDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobs = snapshot.docs.map((doc) =>
          convertDocToJob({ ...doc.data(), id: doc.id })
        );
        callback(jobs);
      },
      (error) => {
        console.error('Error subscribing to jobs:', error);
        if (onError) onError(error as Error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up subscription:', error);
    if (onError) onError(error as Error);
    return () => {};
  }
}
