import { list } from '@vercel/blob';

console.log('🔍 Searching for video files in Vercel Blob...\n');

try {
  // List all files with prefix 375
  const { blobs } = await list({
    prefix: 'images/375-',
    limit: 20
  });

  console.log(`Found ${blobs.length} files:\n`);
  
  blobs.forEach(blob => {
    console.log(`📁 ${blob.pathname}`);
    console.log(`   Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Uploaded: ${blob.uploadedAt}`);
    console.log('');
  });

  if (blobs.length === 0) {
    console.log('❌ No files found with prefix "images/375-"');
    console.log('\nSearching for ANY video files (mp4, mov)...\n');
    
    const { blobs: allVideos } = await list({
      prefix: 'images/',
      limit: 100
    });
    
    const videoFiles = allVideos.filter(b => 
      b.pathname.endsWith('.mp4') || b.pathname.endsWith('.mov') || b.pathname.endsWith('.webm')
    );
    
    console.log(`Found ${videoFiles.length} video files total:\n`);
    videoFiles.slice(0, 10).forEach(blob => {
      console.log(`📹 ${blob.pathname}`);
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}

