import { list } from '@vercel/blob';

export default async function DebugBlobImage() {
  console.log('🔍 DebugBlobImage: Starting server-side test...');
  
  try {
    // Test if we can list any images
    const { blobs } = await list({
      prefix: 'images/',
      limit: 5
    });
    
    console.log('📁 Found blobs:', blobs.length);
    console.log('📋 First few blobs:', blobs.map(b => b.pathname).slice(0, 3));
    
    // Test specific image from our constants
    const testPath = 'images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche';
    console.log('🔍 Testing specific path:', testPath);
    
    const extensions = ['', '.jpg', '.jpeg', '.png'];
    let foundUrl = null;
    
    for (const ext of extensions) {
      const pathToTry = `${testPath}${ext}`;
      const { blobs: specificBlobs } = await list({
        prefix: pathToTry,
        limit: 1
      });
      
      if (specificBlobs.length > 0) {
        foundUrl = specificBlobs[0].url;
        console.log('✅ Found image with extension:', ext, 'URL:', foundUrl?.substring(0, 50) + '...');
        break;
      } else {
        console.log('❌ No image found with extension:', ext);
      }
    }
    
    return (
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-bold">🔍 Server-Side Image Debug</h3>
        <p>Total blobs found: {blobs.length}</p>
        <p>Test image found: {foundUrl ? '✅ Yes' : '❌ No'}</p>
        {foundUrl && (
          <div className="mt-2">
            <p className="text-sm">URL: {foundUrl.substring(0, 80)}...</p>
            <img src={foundUrl} alt="Test" className="w-32 h-32 object-cover mt-2" />
          </div>
        )}
        <details className="mt-2">
          <summary>Available blobs (first 5)</summary>
          <ul className="text-sm">
            {blobs.slice(0, 5).map((blob, i) => (
              <li key={i}>{blob.pathname}</li>
            ))}
          </ul>
        </details>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in DebugBlobImage:', error);
    return (
      <div className="p-4 bg-red-100 rounded">
        <h3 className="font-bold text-red-700">❌ Server-Side Error</h3>
        <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
} 