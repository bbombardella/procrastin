import { contract } from '@procrastin/contract'
import { initServer } from '@ts-rest/fastify'
import { uploadFileToS3 } from '../libs/s3'

const s = initServer()
export const filesRouter = s.router(contract.files, {
	uploadFile: {
		handler: async ({ request }) => {
		
			const file = await request.file()
			
			if (!file) {
				return { status: 400, body: 'No file uploaded' }
			}
	
			try {
				const fileBuffer = await file.toBuffer()
				const fileUrl = await uploadFileToS3(fileBuffer, file.filename)
				if (!fileUrl) return { status: 500, body: 'Failed to upload file' }
				
				return {
					status: 200,
					body: fileUrl,
				}
			} catch (err) {
				return {
					status: 500,
					body: (err as Error).message,
				}
			}
	
		}
	}
})