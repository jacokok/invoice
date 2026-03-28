export function isError(err: unknown): err is Error {
	return (err as Error).message !== undefined;
}
