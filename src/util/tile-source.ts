export function getTile(index: number): string {
  const suit = Math.floor(index / 4);
  const isRed = index % 4 === 0;
  if (suit < 9) {
    if (suit + 1 === 5 && isRed) {
      return `aka1-66-90-l.png`;
    }
    return `pin${suit + 1}-66-90-l.png`;
  } else if (suit < 18) {
    if (suit + 1 === 5 && isRed) {
      return `aka2-66-90-l.png`;
    }
    return `sou${suit - 9 + 1}-66-90-l.png`;
  } else if (suit < 27) {
    if (suit + 1 === 5 && isRed) {
      return `aka3-66-90-l.png`;
    }
    return `man${suit - 18 + 1}-66-90-l.png`;
  } else {
    return `ji${suit - 27 + 1}-66-90-l.png`;
  }
}
