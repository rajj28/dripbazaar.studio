/**
 * Video Frame Extractor
 * Extracts frames from video and saves them as images
 * 
 * Usage: node extract-frames.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const VIDEO_PATH = './public/Firefly A static camera in a 16-9 aspect ratio captures a macro close-up of a thick warm beige parch.mp4';
const OUTPUT_DIR = './public/frames';
const FPS = 30; // Extract 30 frames per second

async function extractFrames() {
    console.log('🎬 Starting frame extraction...\n');

    // Check if video exists
    if (!fs.existsSync(VIDEO_PATH)) {
        console.error('❌ Error: Video file not found at:', VIDEO_PATH);
        process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log('📁 Created output directory:', OUTPUT_DIR);
    } else {
        console.log('📁 Output directory exists:', OUTPUT_DIR);
    }

    // Check if ffmpeg is installed
    try {
        await execAsync('ffmpeg -version');
        console.log('✅ FFmpeg is installed\n');
    } catch (error) {
        console.error('❌ Error: FFmpeg is not installed');
        console.error('Please install FFmpeg:');
        console.error('  - Windows: choco install ffmpeg OR download from https://ffmpeg.org/');
        console.error('  - Mac: brew install ffmpeg');
        console.error('  - Linux: sudo apt-get install ffmpeg');
        process.exit(1);
    }

    // Extract frames using ffmpeg
    console.log(`🎞️  Extracting frames at ${FPS} FPS...`);
    console.log('⏳ This may take a minute...\n');

    const command = `ffmpeg -i "${VIDEO_PATH}" -vf "fps=${FPS}" "${OUTPUT_DIR}/frame_%04d.jpg"`;

    try {
        const { stdout, stderr } = await execAsync(command);
        
        // Count extracted frames
        const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('frame_'));
        
        console.log('\n✅ Frame extraction complete!');
        console.log(`📊 Total frames extracted: ${files.length}`);
        console.log(`📂 Frames saved to: ${OUTPUT_DIR}`);
        console.log(`\n🎉 Done! You can now use these frames in your application.`);
        
    } catch (error) {
        console.error('❌ Error during frame extraction:', error.message);
        process.exit(1);
    }
}

// Run the extraction
extractFrames();
