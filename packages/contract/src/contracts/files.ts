import { initContract } from '@ts-rest/core'

const c = initContract()

export const filesContract = c.router(
	{
		uploadFile: {
            method: 'POST',
            path: '',
            contentType: 'multipart/form-data',
            summary: 'Upload a file',
            body: c.type<{
                file: {
                    uri: string
                    type: string
                    name: string
                }
            }>(),
            responses: {
                200: c.type<string>(),
                400: c.type<string>(),
                500: c.type<string>(),
            }
		},
	},
	{
		pathPrefix: '/files',
	}
)