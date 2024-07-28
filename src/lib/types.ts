// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isError(err: any | unknown): err is Error {
	return (err as Error).message !== undefined;
}
