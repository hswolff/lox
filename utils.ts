export function print(msg: string) {
  return Deno.stdout.writeSync(new TextEncoder().encode(msg));
}

export function println(msg: string) {
  return print(msg + '\n');
}

export async function readLine() {
  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf);
  if (n == null) {
    return n;
  }
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}
