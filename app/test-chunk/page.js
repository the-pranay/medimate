// Simple test page to check if chunk loading works
export default function TestChunkLoad() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chunk Loading Test</h1>
      <p>If you can see this page, the basic Next.js routing and chunk loading is working.</p>
      <p>Time: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <strong>Test Status: </strong>
        <span style={{ color: 'green' }}>✅ Page loaded successfully</span>
      </div>
    </div>
  );
}
