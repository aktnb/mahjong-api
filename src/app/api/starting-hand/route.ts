import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import { shuffle } from "@/util/shuffle";
import path from "path";
import { getTile } from "@/util/tile-source";

// Function to sort tiles by suit according to the specified order
function sortTiles(hand: number[]): number[] {
  // Sort based on the specified mapping and order
  return [...hand].sort((a, b) => {
    // Get tile categories
    const categoryA =
      a >= 72 && a <= 107
        ? 0 // Manzu (萬子)
        : a >= 0 && a <= 35
        ? 1 // Pinzu (筒子)
        : a >= 36 && a <= 71
        ? 2 // Souzu (索子)
        : 3; // Honor tiles (字牌)

    const categoryB =
      b >= 72 && b <= 107
        ? 0 // Manzu (萬子)
        : b >= 0 && b <= 35
        ? 1 // Pinzu (筒子)
        : b >= 36 && b <= 71
        ? 2 // Souzu (索子)
        : 3; // Honor tiles (字牌)

    // Sort by category first
    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    // Within the same category, sort by tile number
    return a - b;
  });
}

export async function GET() {
  const canvas = createCanvas(1000, 300);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#089b5f";
  ctx.fillRect(0, 0, 1000, 300);

  // Generate a random starting hand
  const deck = [...Array(136).keys()];
  shuffle(deck);

  // Get a dora indicator
  const doraIndicator = deck[0];

  // Get a starting hand with the remaining tiles
  const hand = deck.slice(1, 15);

  // Sort the hand tiles by suit
  const sortedHand = sortTiles(hand);

  // Load Mahjong tile images
  const tileWidth = 60;
  const tileHeight = 80;
  // Make dora tiles smaller (80% of the hand tiles)
  const doraTileWidth = 48;
  const doraTileHeight = 64;
  const basePath = path.resolve("./public/pai-images");

  // First calculate the left margin for the hand tiles
  const handTilesWidth = sortedHand.length * tileWidth;
  const leftMargin = (canvas.width - handTilesWidth) / 2;

  // Use the same left margin for dora indicators as the hand tiles
  const doraRowCount = 7;
  const doraRowY = 40;

  // Set doraLeftMargin to match the hand tiles' left margin
  const doraLeftMargin = leftMargin;

  // Draw the 7 tiles (dora indicator is the 3rd tile, others are face down)
  for (let i = 0; i < doraRowCount; i++) {
    try {
      // Draw shadow for all tiles first
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(
        doraLeftMargin + i * doraTileWidth + 3,
        doraRowY + 3,
        doraTileWidth,
        doraTileHeight
      );

      if (i === 2) {
        // Draw the dora indicator as the 3rd tile
        const doraPath = path.join(basePath, getTile(doraIndicator));
        const doraImage = await loadImage(doraPath);
        ctx.drawImage(
          doraImage,
          doraLeftMargin + i * doraTileWidth,
          doraRowY,
          doraTileWidth,
          doraTileHeight
        );
      } else {
        // Draw face-down tiles with solid color and border
        ctx.fillStyle = "#66b4fc"; // Blue color for the back of tiles
        ctx.fillRect(
          doraLeftMargin + i * doraTileWidth,
          doraRowY,
          doraTileWidth,
          doraTileHeight
        );

        // Add a border to show the edges of the tiles
        ctx.strokeStyle = "#5590c7"; // Slightly darker blue for the border
        ctx.lineWidth = 1;
        ctx.strokeRect(
          doraLeftMargin + i * doraTileWidth,
          doraRowY,
          doraTileWidth,
          doraTileHeight
        );
      }
    } catch (error) {
      console.error(`Failed to draw tile at position ${i}`, error);
    }
  }

  // Position the hand tiles lower in the canvas
  const handY = 170; // Move down from center to make room for dora indicator

  // Draw shadows for all hand tiles first
  for (let i = 0; i < sortedHand.length; i++) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(
      leftMargin + i * tileWidth + 4,
      handY + 4,
      tileWidth,
      tileHeight
    );
  }

  // Then draw the actual hand tiles
  for (let i = 0; i < sortedHand.length; i++) {
    const tileIndex = sortedHand[i];
    const tilePath = path.join(basePath, getTile(tileIndex));
    try {
      const tileImage = await loadImage(tilePath);
      // Add leftMargin to center the tiles horizontally and use the new Y position
      const x = leftMargin + i * tileWidth;
      ctx.drawImage(tileImage, x, handY, tileWidth, tileHeight);
    } catch (error) {
      console.error(`Failed to load tile image: ${tilePath}`, error);
    }
  }

  // Return the image as a response
  const buffer = canvas.toBuffer("image/png");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
