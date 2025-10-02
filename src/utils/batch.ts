type SuccessResult<R> = { ok: true; value: R };
type ErrorResult = { ok: false; error: unknown };
type BatchResult<R> = SuccessResult<R> | ErrorResult;

export async function runInBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  batchSize = 5
): Promise<{ successes: R[]; errors: { item: T; error: unknown }[] }> {
  const successes: R[] = [];
  const errors: { item: T; error: unknown }[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const promises: Promise<BatchResult<R>>[] = batch.map((it) =>
      worker(it)
        .then<SuccessResult<R>>((value) => ({ ok: true, value }))
        .catch<ErrorResult>((error) => ({ ok: false, error }))
    );

    const results = await Promise.all(promises);

    results.forEach((res, idx) => {
      if (res.ok) {
        successes.push(res.value);
      } else {
        errors.push({ item: batch[idx], error: res.error });
      }
    });
  }

  return { successes, errors };
}
