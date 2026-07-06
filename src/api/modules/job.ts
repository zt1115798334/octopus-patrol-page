import { get, post, del } from '@/lib/api-client'
import type { ResultMessage, JobDto } from '@/types'

export function addJob(data: JobDto): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/job/addJob', data)
}

export function pauseJob(data: { jobName: string; jobGroup: string }): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/job/pauseJob', data)
}

export function resumeJob(data: { jobName: string; jobGroup: string }): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/job/resumeJob', data)
}

export function deleteJob(data: { jobName: string; jobGroup: string }): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/job/deleteJob', data)
}

export function findAllJobs(): Promise<ResultMessage<Record<string, unknown>[]>> {
  return get<ResultMessage<Record<string, unknown>[]>>('/job/findAllJobs')
}
