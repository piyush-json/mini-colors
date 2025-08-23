import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from 'hono/validator';
import { cors } from 'hono/cors';

const ColorGameMetadataSchema = z.object({
	targetColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Target color must be a valid hex color'),
	capturedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Captured color must be a valid hex color'),
	timeTaken: z.number().min(0, 'Time taken must be a positive number'),
	similarity: z.number().min(0).max(100),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
	mode: z.enum(['finding', 'color-mixing']),
	image: z.string().refine(
		(val) => {
			const base64Pattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
			return base64Pattern.test(val);
		},
		{
			message: 'Image must be a valid base64 data URL with data:image/type;base64, prefix',
		},
	),
});

const app = new Hono<{
	Bindings: Cloudflare.Env;
}>();

app.use(
	cors({
		origin: '*',
		allowMethods: ['POST', 'OPTIONS'],
		maxAge: 3600,
	}),
);

// const rateLimitMiddleware = async (c: any, next: any) => {
// 	const identifier = c.req.header('cf-connecting-ip') || 'unknown';
// 	try {
// 		const rateLimitKey = `upload:${identifier}`;
// 		const rateLimitResult = await c.env.RATE_LIMITER.limit({ key: rateLimitKey });

// 		if (!rateLimitResult.success) {
// 			return c.json(
// 				{
// 					error: 'Rate limit exceeded',
// 					retryAfter: rateLimitResult.retryAfter,
// 				},
// 				429,
// 			);
// 		}
// 		await next();
// 	} catch (error) {
// 		console.error('Rate limiting error:', error);
// 		await next();
// 	}
// };

// Color Game Metadata Upload Endpoint
// Accepts game result data and creates NFT metadata with uploaded image
// Mode can be "finding" (upload image to find color) or "color-mixing" (mix colors to match target)
app.post(
	'/color-game/metadata',
	validator('json', (value, c) => {
		const parsed = ColorGameMetadataSchema.safeParse(value);
		if (!parsed.success) {
			return c.json({ error: 'Invalid color game metadata', details: parsed.error }, 400);
		}
		return parsed.data;
	}),
	async (c) => {
		try {
			const validatedData = c.req.valid('json');
			const key = `color_game_${Date.now()}_${Math.random().toString(36).substring(7)}`;

			const publicBucketUrl = c.env.PUBLIC_BUCKET_URL || 'https://your-bucket.r2.dev';

			// Process and upload the image
			let processedImageUrl = '';
			let imageType = 'png';
			try {
				const imageBase64 = validatedData.image;
				const base64Data = imageBase64.replace(/^data:image\/([a-zA-Z]+);base64,/, '');
				imageType = imageBase64.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'png';

				const imageBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
				const imageKey = `color-game-images/${key}.${imageType}`;

				await c.env.BUCKET.put(imageKey, imageBuffer, {
					httpMetadata: {
						contentType: `image/${imageType}`,
					},
				});

				processedImageUrl = `${publicBucketUrl}/${imageKey}`;
			} catch (imageError) {
				console.error('Failed to process base64 image:', imageError);
				return c.json({ error: 'Image processing failed' }, 500);
			}

			// Create NFT metadata in the requested format
			const nftMetadata = {
				name: `Play Shade - ${validatedData.date}`,
				description: `An NFT minted for matching the target color using ${validatedData.mode === 'finding' ? 'color finding' : 'color mixing'} gameplay. This token represents a successful attempt with ${validatedData.similarity}% accuracy.`,
				image: processedImageUrl,
				attributes: [
					{
						trait_type: 'Target Color',
						value: validatedData.targetColor,
					},
					{
						trait_type: 'User Found Color',
						value: validatedData.capturedColor,
					},
					{
						trait_type: 'Match Percentage',
						value: validatedData.similarity.toString(),
					},
					{
						trait_type: 'Time Taken',
						value: validatedData.timeTaken.toString(),
					},
					{
						trait_type: 'Date of Match',
						value: validatedData.date,
					},
					{
						trait_type: 'Game Mode',
						value: validatedData.mode,
					},
				],
			};

			// Upload metadata JSON
			const metadataKey = `color-game-metadata/${key}.json`;
			await c.env.BUCKET.put(metadataKey, JSON.stringify(nftMetadata, null, 2), {
				httpMetadata: {
					contentType: 'application/json',
				},
			});

			return c.json({
				success: true,
				uri: `${publicBucketUrl}/${metadataKey}`,
				imageUrl: processedImageUrl,
				metadata: nftMetadata,
				message: 'Color game NFT metadata uploaded successfully',
			});
		} catch (error) {
			console.error('Color game upload error:', error);
			return c.json({ error: 'Upload failed' }, 500);
		}
	},
);

// // Simple image upload endpoint
// const ImageUploadSchema = z.object({
// 	image: z.string().refine(
// 		(val) => {
// 			const base64Pattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
// 			return base64Pattern.test(val);
// 		},
// 		{
// 			message: 'Image must be a valid base64 data URL with data:image/type;base64, prefix',
// 		},
// 	),
// });

// app.post(
// 	'/upload/image',
// 	validator('json', (value, c) => {
// 		const parsed = ImageUploadSchema.safeParse(value);
// 		if (!parsed.success) {
// 			return c.json({ error: 'Invalid image data', details: parsed.error }, 400);
// 		}
// 		return parsed.data;
// 	}),
// 	async (c) => {
// 		try {
// 			const validatedData = c.req.valid('json');
// 			const key = `image_${Date.now()}_${Math.random().toString(36).substring(7)}`;

// 			const publicBucketUrl = c.env.PUBLIC_BUCKET_URL || 'https://your-bucket.r2.dev';

// 			// Process and upload the image
// 			try {
// 				const imageBase64 = validatedData.image;
// 				const base64Data = imageBase64.replace(/^data:image\/([a-zA-Z]+);base64,/, '');
// 				const imageType = imageBase64.match(/^data:image\/([a-zA-Z]+);base64,/)?.[1] || 'png';

// 				const imageBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
// 				const imageKey = `images/${key}.${imageType}`;

// 				await c.env.BUCKET.put(imageKey, imageBuffer, {
// 					httpMetadata: {
// 						contentType: `image/${imageType}`,
// 					},
// 				});

// 				const imageUrl = `${publicBucketUrl}/${imageKey}`;

// 				return c.json({
// 					success: true,
// 					url: imageUrl,
// 					message: 'Image uploaded successfully',
// 				});
// 			} catch (imageError) {
// 				console.error('Failed to process base64 image:', imageError);
// 				return c.json({ error: 'Image processing failed' }, 500);
// 			}
// 		} catch (error) {
// 			console.error('Image upload error:', error);
// 			return c.json({ error: 'Upload failed' }, 500);
// 		}
// 	},
// );

export default app;
