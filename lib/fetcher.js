export default async function Fetcher(...args) {
  const res = await fetch(...args);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? `request failed with status ${res.status}`);
  }

  return data;
}
