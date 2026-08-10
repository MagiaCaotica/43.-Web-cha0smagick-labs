// Copyright (c) 2024 Shafil Alam

import { VideoGen } from "./videogen";
import { Client } from "node-pexels";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import path from "path";
import fluent_ffmpeg from "fluent-ffmpeg";
import ffmpegStaticPath from "ffmpeg-static";

/**
 * Image generation types
 */
export enum ImageGenType {
    Pexels = "Pexels",
    GoogleScraper = "GoogleScraper",
    FluxAI = "FluxAI",
}

/**
 * Image API Key environment variables
 */
export enum ImageAPIEnv {
    PexelsAPIKey = "PEXELS_API_KEY",
}

/**
 * Image style types
 */
export enum ImageStyleType {
    /** AI generated images */
    AI = "AI",
    /** Real images */
    Search = "Search",
}

/**
 * Options for AI image generation
 */
export interface AIImageGenOptions {
    /** Model name */
    modelName: string;
    /** Additional prompt */
    suffixPrompt: string;
}

/**
 * Base class for image generation
 * @abstract
 */
export class ImageGen {
    /** Image style type */
    styleType: ImageStyleType = ImageStyleType.Search;

    static async generateImages(gen: VideoGen, images: string[], tempPath: string, changePhotos: boolean): Promise<string[]> {
        throw new Error("Method 'generateImage' must be implemented");
    }
}

/**
 * Image generation using Pexels API
 */
export class PexelsImageGen extends ImageGen {
    /** Image style type */
    public static styleType: ImageStyleType = ImageStyleType.Search;

    /**
     * Generate images using Pexels API
     * @param images - List of image queries
     * @param tempPath - Temporary path to save images
     * @param changePhotos - Change photos or not
     * @param apiKey - Pexels API key (required)
     * @param filePrefix - File prefix for images
     * @returns List of image paths
     */
    static async generateImages(gen: VideoGen, images: string[], tempPath: string, changePhotos: boolean, apiKey?: string, filePrefix?: string): Promise<string[]> {
        if (!apiKey) {
            throw new Error("Pexels API key required");
        }

        const client = new Client({ apiKey: apiKey });
        const imgs: string[] = [];

        for (const [index, _] of images.entries()) {
            if (changePhotos) {
                const query = images[index];
                gen.log(`Searching for images for rank ${index + 1} with query: ${query}`);

                const r_images_rep = await client.v1.photos.search(query, { perPage: 1, page: 1 });
                const r_image1 = r_images_rep.photos[0].src.large;

                // Download images with axios
                const r_image_path = path.join(tempPath, `image-${filePrefix ?? index}.png`);

                const image_response = await axios.get(r_image1, { responseType: 'arraybuffer' });
                fs.writeFileSync(r_image_path, image_response.data);

                imgs.push(r_image_path);

                gen.log(`Image for rank ${index + 1} downloaded successfully at ${r_image_path}`);
            } else {
                const r_image_path = path.join(tempPath, `image-${filePrefix ?? index}.png`);

                imgs.push(r_image_path);

                gen.log(`Image for rank ${index + 1} downloaded successfully at ${r_image_path}`);
            }
        }

        return imgs;
    }
}

/**
 * Image generation using Google
 */
export class GoogleScraperImageGen extends ImageGen {
    /** Image style type */
    public static styleType: ImageStyleType = ImageStyleType.Search;

    /**
     * Generate images using Google
     * @param images - List of image queries
     * @param tempPath - Temporary path to save images
     * @param changePhotos - Change photos or not
     * @param filePrefix - File prefix for images
     * @returns List of image paths
     */
    static async generateImages(gen: VideoGen, images: string[], tempPath: string, changePhotos: boolean, filePrefix?: string): Promise<string[]> {
        const imgs: string[] = [];

        if (changePhotos) {
            const urls = await this.imgScrape(images);
            for (const [index, url] of urls?.entries() ?? []) {
                const img_path = path.join(tempPath, `image-${filePrefix ?? index}.png`);

                const base64Data = url.replace(/^data:image\/(png|jpeg|gif);base64,/, '');
                fs.writeFileSync(img_path, base64Data, 'base64');

                gen.log(`Image generated: ${img_path} - GoogleScraperImageGen`);

                imgs.push(img_path);
            }
        } else {
            for (const [index, _] of images.entries()) {
                const img_path = path.join(tempPath, `image-${filePrefix ?? index}.png`);
                gen.log(`Image added: ${img_path}`);
                imgs.push(img_path);
            }
        }

        return imgs;
    }

    private static async imgScrape(queries: string[]) {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const images = [];
            for (const query of queries) {
                await page.goto(`https://www.google.com/search?tbm=isch&q=${query}`);

                // Scroll to the bottom of the page to load more images
                await page.evaluate(async () => {
                    for (let i = 0; i < 1; i++) {
                        window.scrollBy(0, window.innerHeight);
                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for more images to load
                    }
                });

                // Wait for images to be loaded
                await page.waitForSelector('img');

                // Extract image URLs
                const urls = await page.evaluate(() => {
                    const imageElements = document.querySelectorAll('img');
                    const urls: string[] = [];
                    imageElements.forEach(img => {
                        const url = img.src;
                        if (url.startsWith('data')) {
                            urls.push(url);
                        }
                    });
                    return urls.slice(0, 1); // Limit to first 1 image URLs
                });

                images.push(...urls);
            }

            await browser.close();
            return images;

        } catch (err) {
            console.error('An error occurred:', err);
        }
    }
}

/**
 * Image generation using Flux AI (via AI Horde API)
 */
export class FluxAIImageGen extends ImageGen {
    /** Image style type */
    public static styleType: ImageStyleType = ImageStyleType.AI;

    private static readonly API_BASE = "https://aihorde.net/api/v2";

    /**
     * Generate images using Flux AI (AI Horde)
     * @param images - List of image queries (prompts)
     * @param tempPath - Temporary path to save images
     * @param changePhotos - Change photos or not
     * @param aiOptions - AI image generation options
     * @param filePrefix - File prefix for images
     * @returns List of image paths
     */
    static async generateImages(gen: VideoGen, images: string[], tempPath: string, changePhotos: boolean, aiOptions?: AIImageGenOptions, filePrefix?: string): Promise<string[]> {
        const imgs: string[] = [];

        const apiKey = process.env.AI_HORDE_API_KEY ?? "0000000000"; // Anonymous fallback
        const modelName = aiOptions?.modelName ?? "stable_diffusion";
        const suffixPrompt = aiOptions?.suffixPrompt ?? "";

        for (const [index, query] of images.entries()) {
            const img_path = path.join(tempPath, `image-${filePrefix ?? index}.png`);

            if (changePhotos) {
                const prompt = suffixPrompt ? `${query}, ${suffixPrompt}` : query;
                gen.log(`Generating AI image for rank ${index + 1} with model: ${modelName} | prompt: ${prompt}`);

                // 1. Submit async generation request
                const submitResp = await axios.post(
                    `${this.API_BASE}/generate/async`,
                    {
                        prompt,
                        params: { width: 512, height: 576, steps: 12, cfg_scale: 5 },
                        models: [modelName],
                        nsfw: false,
                    },
                    {
                        headers: {
                            "apikey": apiKey,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "User-Agent": "auto-shorts/0.2.0",
                            "Client-Agent": "auto-shorts:0.2.0:https://github.com/alamshafil/auto-shorts",
                        },
                    }
                );

                const jobId = submitResp.data.id;

                // 2. Poll until generation is done
                let done = false;
                let attempts = 0;
                const maxAttempts = 120; // 120 * 5s = 10 minutes max
                while (!done && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    attempts++;
                    const checkResp = await axios.get(
                        `${this.API_BASE}/generate/check/${jobId}`,
                        { headers: { "apikey": apiKey, "Accept": "application/json" } }
                    );
                    gen.log(`AI image job ${jobId} status: ${JSON.stringify(checkResp.data)}`);
                    done = checkResp.data.done === true;
                }

                if (!done) {
                    throw new Error(`AI Horde image generation timed out for job ${jobId}`);
                }

                // 3. Retrieve generated image URL
                const statusResp = await axios.get(
                    `${this.API_BASE}/generate/status/${jobId}`,
                    { headers: { "apikey": apiKey, "Accept": "application/json" } }
                );

                const generations = statusResp.data.generations ?? [];
                if (generations.length === 0) {
                    throw new Error(`AI Horde returned no generations for job ${jobId}: ${JSON.stringify(statusResp.data)}`);
                }

                const imageUrl = generations[0].img;
                gen.log(`AI image for rank ${index + 1} ready at: ${imageUrl}`);

                // 4. Download the image (arrives as .webp)
                const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
                const webpPath = path.join(tempPath, `image-${filePrefix ?? index}.webp`);
                fs.writeFileSync(webpPath, imageResp.data);

                // 5. Convert .webp -> .png via fluent-ffmpeg.
                // fluent-ffmpeg locates the binary via the FFMPEG_PATH env var; fall back to the
                // bundled ffmpeg-static binary when no system ffmpeg is available on PATH.
                const previousFfmpegPath = process.env.FFMPEG_PATH;
                try {
                    if (!process.env.FFMPEG_PATH && ffmpegStaticPath) {
                        process.env.FFMPEG_PATH = ffmpegStaticPath;
                    }
                    await new Promise<void>((resolve, reject) => {
                        fluent_ffmpeg(webpPath)
                            .output(img_path)
                            .on("end", () => resolve())
                            .on("error", (err) => reject(new Error(`Failed to convert webp to png: ${err.message}`)))
                            .run();
                    });
                } finally {
                    if (previousFfmpegPath === undefined) {
                        delete process.env.FFMPEG_PATH;
                    } else {
                        process.env.FFMPEG_PATH = previousFfmpegPath;
                    }
                }

                try { fs.unlinkSync(webpPath); } catch { /* best effort cleanup */ }

                gen.log(`Image for rank ${index + 1} downloaded successfully at ${img_path}`);
            } else {
                gen.log(`Image for rank ${index + 1} downloaded successfully at ${img_path}`);
            }

            imgs.push(img_path);
        }

        return imgs;
    }
}
