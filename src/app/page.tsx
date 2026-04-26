export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Heedy Project</h1>
      <p className="mt-4">Frontend setup is ready 🚀</p>
      <p className="mt-4">All are welcome 🚀</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => alert('Hello World')}>Click Me</button>
    </div>
  );
}